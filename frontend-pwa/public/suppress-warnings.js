// Script para suprimir warnings específicos do console
(function() {
  // Suprimir warnings do Google Places API
  const originalWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    
    // Suprimir warnings específicos do Google Places API
    if (message.includes('google.maps.places.Autocomplete is not available to new customers') ||
        message.includes('PlaceAutocompleteElement instead') ||
        message.includes('legacy for additional details')) {
      return; // Não exibir este warning
    }
    
    // Exibir outros warnings normalmente
    originalWarn.apply(console, args);
  };
  
  // Suprimir warnings do Google Maps sobre carregamento
  const originalLog = console.log;
  console.log = function(...args) {
    const message = args.join(' ');
    
    // Suprimir warnings específicos do Google Maps
    if (message.includes('Google Maps JavaScript API has been loaded directly without loading=async')) {
      return; // Não exibir este warning
    }
    
    // Exibir outros logs normalmente
    originalLog.apply(console, args);
  };
})();
