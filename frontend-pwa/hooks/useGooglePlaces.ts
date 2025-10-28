import { useEffect, useRef, useState } from 'react';

interface AddressComponents {
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude: number;
  longitude: number;
}

// Declarar tipos globais do Google Maps
declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export function useGooglePlaces() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const callbackRef = useRef<((address: AddressComponents) => void) | null>(null);

  const GOOGLE_API_KEY = 'AIzaSyAQwzzNgIGCxbRM2bWa9BU4ixIW-UGIo14';

  useEffect(() => {
    const loadGoogleMaps = () => {
      console.log('🔄 Iniciando carregamento do Google Maps API...');
      
      // Verificar se já está carregado
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsLoaded(true);
        console.log('✅ Google Maps API já carregada');
        return;
      }

      // Função de callback para quando a API carregar
      window.initGoogleMaps = () => {
        console.log('🎯 Callback initGoogleMaps executado');
        if (window.google && window.google.maps && window.google.maps.places) {
          setIsLoaded(true);
          console.log('✅ Google Maps API carregada com sucesso');
        } else {
          console.error('❌ Google Maps API carregada mas objetos não disponíveis');
          setError('Google Maps API carregada mas objetos não disponíveis');
        }
      };

      // Carregar script do Google Maps
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&callback=initGoogleMaps&loading=async`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('📜 Script do Google Maps carregado');
      };
      
      script.onerror = (error) => {
        console.error('❌ Erro ao carregar Google Maps API:', error);
        setError('Erro ao carregar Google Maps API');
      };

      console.log('📡 Adicionando script do Google Maps ao DOM');
      document.head.appendChild(script);

      // Cleanup
      return () => {
        console.log('🧹 Limpando script do Google Maps');
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        window.initGoogleMaps = undefined as any;
      };
    };

    const cleanup = loadGoogleMaps();
    return cleanup;
  }, []);

  const parseAddressComponents = (place: any): AddressComponents => {
    const components = place.address_components || [];
    const geometry = place.geometry;
    
    console.log('🔍 Analisando componentes do endereço:', components);
    
    let logradouro = '';
    let numero = '';
    let bairro = '';
    let cidade = '';
    let estado = '';
    let cep = '';

    // Parse dos componentes do endereço
    components.forEach((component: any) => {
      const types = component.types;
      console.log('📋 Componente:', component.long_name, 'Types:', types);
      
      if (types.includes('route')) {
        // Rua/Avenida/Travessa - apenas o nome do logradouro
        logradouro = component.long_name;
        console.log('🛣️ Logradouro encontrado:', logradouro);
      } else if (types.includes('street_number')) {
        // Número da rua
        numero = component.long_name;
        console.log('🔢 Número encontrado:', numero);
      } else if (types.includes('sublocality') || types.includes('sublocality_level_1') || types.includes('sublocality_level_2')) {
        // Bairro - tentar diferentes níveis
        if (!bairro) { // Pegar o primeiro encontrado
          bairro = component.long_name;
          console.log('🏘️ Bairro encontrado:', bairro);
        }
      } else if (types.includes('administrative_area_level_2')) {
        // Cidade
        cidade = component.long_name;
        console.log('🏙️ Cidade encontrada:', cidade);
      } else if (types.includes('locality')) {
        // Cidade (fallback)
        if (!cidade) {
          cidade = component.long_name;
          console.log('🏙️ Cidade (locality) encontrada:', cidade);
        }
      } else if (types.includes('administrative_area_level_1')) {
        // Estado
        estado = component.short_name;
        console.log('🗺️ Estado encontrado:', estado);
      } else if (types.includes('postal_code')) {
        // CEP
        cep = component.long_name;
        console.log('📮 CEP encontrado:', cep);
      }
    });

    // Montar endereço apenas com logradouro e número (se disponível)
    let endereco = logradouro;
    if (numero) {
      endereco += `, ${numero}`;
    }

    console.log('🏠 Componentes extraídos:', {
      logradouro,
      numero,
      enderecoCompleto: endereco,
      bairro,
      cidade,
      estado,
      cep
    });

    return {
      endereco,
      bairro,
      cidade,
      estado,
      cep,
      latitude: geometry?.location?.lat() || 0,
      longitude: geometry?.location?.lng() || 0
    };
  };

  const initializeAutocomplete = (inputElement: HTMLInputElement) => {
    console.log('🔧 Tentando inicializar autocomplete:', {
      isLoaded,
      hasInputElement: !!inputElement,
      hasGoogle: !!window.google,
      hasMaps: !!(window.google && window.google.maps),
      hasPlaces: !!(window.google && window.google.maps && window.google.maps.places)
    });

    if (!isLoaded || !inputElement || !window.google) {
      console.log('❌ Condições não atendidas para inicializar autocomplete');
      return;
    }

    try {
      // Limpar autocomplete anterior se existir
      if (autocompleteRef.current) {
        console.log('🧹 Limpando autocomplete anterior');
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }

      inputRef.current = inputElement;

      console.log('🏗️ Criando novo autocomplete...');
      
      // Usar a nova API recomendada se disponível, senão usar a legada
      if (window.google.maps.places.PlaceAutocompleteElement) {
        console.log('🆕 Usando PlaceAutocompleteElement (nova API)');
        // TODO: Implementar PlaceAutocompleteElement quando estiver disponível
        // Por enquanto, usar a API legada com warning suprimido
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputElement, {
          types: ['address'],
          componentRestrictions: { country: 'br' }, // Restringir ao Brasil
          fields: ['address_components', 'formatted_address', 'geometry']
        });
      } else {
        console.log('📜 Usando Autocomplete (API legada)');
        // Configurar autocomplete
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputElement, {
          types: ['address'],
          componentRestrictions: { country: 'br' }, // Restringir ao Brasil
          fields: ['address_components', 'formatted_address', 'geometry']
        });
      }

      console.log('✅ Google Places Autocomplete inicializado com sucesso');

      // Configurar listener para place_changed
      autocompleteRef.current.addListener('place_changed', () => {
        console.log('📍 Evento place_changed disparado');
        
        const place = autocompleteRef.current?.getPlace();
        console.log('🏠 Place obtido:', place);
        
        if (!place || !place.geometry) {
          console.log('❌ Place não encontrado ou sem geometria');
          return;
        }

        console.log('📍 Place selecionado:', place);
        
        try {
          const addressComponents = parseAddressComponents(place);
          console.log('🏠 Componentes do endereço:', addressComponents);
          
          if (callbackRef.current) {
            callbackRef.current(addressComponents);
            console.log('✅ Callback executado com sucesso');
          }
        } catch (err: any) {
          console.error('❌ Erro ao processar endereço:', err);
          setError('Erro ao processar endereço selecionado: ' + (err?.message || 'Erro desconhecido'));
        }
      });

      // Configurar listener adicional para detectar quando o usuário clica em uma sugestão
      inputElement.addEventListener('blur', () => {
        console.log('👆 Input perdeu foco - verificando se há place selecionado');
        setTimeout(() => {
          const place = autocompleteRef.current?.getPlace();
          if (place && place.geometry) {
            console.log('🎯 Place encontrado no blur:', place);
            try {
              const addressComponents = parseAddressComponents(place);
              console.log('🏠 Componentes do endereço (blur):', addressComponents);
              if (callbackRef.current) {
                callbackRef.current(addressComponents);
                console.log('✅ Callback executado via blur');
              }
            } catch (err: any) {
              console.error('❌ Erro ao processar endereço (blur):', err);
            }
          }
        }, 200);
      });

    } catch (err: any) {
      console.error('❌ Erro ao inicializar autocomplete:', err);
      setError('Erro ao inicializar autocomplete: ' + (err?.message || 'Erro desconhecido'));
    }
  };

  const onPlaceSelected = (callback: (address: AddressComponents) => void) => {
    console.log('🎯 Configurando callback para place_changed');
    callbackRef.current = callback;
  };

  const cleanup = () => {
    if (autocompleteRef.current && window.google) {
      window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      autocompleteRef.current = null;
    }
    inputRef.current = null;
    callbackRef.current = null;
  };

  return {
    isLoaded,
    error,
    initializeAutocomplete,
    onPlaceSelected,
    cleanup
  };
}