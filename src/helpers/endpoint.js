import axios from 'axios';

function getProtocol() {
  const url = new URL(document.location.href);
  return url.protocol.slice(0, -1); // Remove colon from protocol to fit registry protocol information
}

export default function getEquivalentEndpoint(endpoints) {
  if (endpoints === undefined) return '';

  for (let i = 0; i < endpoints.length; i++) {
    if (endpoints[i].protocolInformation.endpointProtocol === getProtocol()) {
      return endpoints[i].protocolInformation.endpointAddress;
    }
  }
  return '';
}
