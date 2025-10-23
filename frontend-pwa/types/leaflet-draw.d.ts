// Declaração de tipos para leaflet-draw
declare module 'leaflet-draw' {
  import * as L from 'leaflet';

  namespace L {
    namespace Draw {
      interface DrawOptions {
        position?: string;
        draw?: any;
        edit?: any;
        remove?: any;
      }

      class DrawControl extends L.Control {
        constructor(options?: DrawOptions);
        addTo(map: L.Map): this;
        remove(): this;
      }
    }
  }

  export = L;
}
