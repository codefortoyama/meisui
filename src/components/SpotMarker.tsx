import L from 'leaflet';

export const SpotMarker = (props: {
  position: [number, number];
  onClick?: () => void;
  visited: boolean;
  name: string;
}) => {
  const {position, onClick, visited, name} = props;

  const getIcon = (name: string) => {
    if (name.includes('滝')) return '🌊';
    if (name.includes('川')) return '🛶';
    if (name.includes('池') || name.includes('湖')) return '🌐';
    return '💧';
  };

  const iconEmoji = getIcon(name);

  const divIcon = L.divIcon({
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: ${visited ? '#059669' : '#0ea5e9'};
        border: 2px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          font-size: 16px;
          margin-top: -2px;
          margin-left: -2px;
        ">
          ${visited ? '✅' : iconEmoji}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });

  const marker = L.marker(position, {divIcon} as L.MarkerOptions);
  if (onClick) {
    marker.on('click', onClick);
  }

  marker.bindTooltip(name, {
    permanent: false,
    direction: 'top',
    offset: [0, -36]
  });

  return marker;
};
