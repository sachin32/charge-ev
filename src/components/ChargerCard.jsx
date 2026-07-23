export default function ChargerCard({ charger, referenceData }) {
  const address = charger.AddressInfo || {};
  const locationLine = [address.AddressLine1, address.Town, address.StateOrProvince, address.Postcode]
    .filter(Boolean)
    .join(", ");

  const getConnectionTypeName = (connectionTypeId) => {
    if (!referenceData?.ConnectionTypes) return "Unknown";
    const connType = referenceData.ConnectionTypes.find((ct) => ct.ID === connectionTypeId);
    return connType?.Title || "Unknown";
  };

  const getOperatorName = (operatorId) => {
    if (!referenceData?.Operators) return null;
    const operator = referenceData.Operators.find((op) => op.ID === operatorId);
    return operator?.Title;
  };

  const operatorName = charger.OperatorID ? getOperatorName(charger.OperatorID) : null;

  const getVehicleTypes = (charger) => {
    const keywords = charger.Connections?.flatMap((connection) => {
      const possible = [];
      if (connection.ConnectionType?.Title) possible.push(connection.ConnectionType.Title);
      if (connection.ConnectionTypeTitle) possible.push(connection.ConnectionTypeTitle);
      if (connection.Title) possible.push(connection.Title);
      return possible;
    }) || [];

    const values = keywords.map((value) => String(value).toLowerCase()).join(" ");
    const isBike = /motorcycle|motorbike|bike|scooter|two wheeler|two-wheeler|two-wheeler|2 Ev Wheeler/.test(values);
    const isCar = /car|auto|sedan|suv|tesla|ccs|chademo|type 2|j1772|type-2|type-1/.test(values);

    if (isBike && isCar) return "Bike / Car";
    if (isBike) return "Bike";
    if (isCar) return "Car";
    return "Car";
  };

  const vehicleLabel = getVehicleTypes(charger);

  const handleNavigate = () => {
    const lat = address.Latitude;
    const lng = address.Longitude;
    if (lat && lng) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(mapsUrl, "_blank");
    }
  };

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{address.Title || "EV Charger"}</h3>
          <p className="text-sm leading-6 text-slate-600">{locationLine || "Location details unavailable."}</p>
          {operatorName && <p className="text-xs text-slate-500">Operator: {operatorName}</p>}
        </div>
        
      </div>
      <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 whitespace-nowrap">
          {charger.NumberOfPoints || charger.Connections?.length || 1} ports
        </div>

      {address.Distance !== undefined && (
        <p className="mt-4 text-sm text-slate-500">Distance: {address.Distance.toFixed(1)} km</p>
      )}

      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Vehicle type</p>
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {vehicleLabel}
        </span>
      </div>

      {charger.Connections?.length > 0 && (
        <div className="mt-4 grid gap-2 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Connection types</p>
          <div className="flex flex-wrap gap-2">
            {charger.Connections.slice(0, 3).map((connection) => (
              <span key={connection.ID} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {getConnectionTypeName(connection.ConnectionTypeID)}
              </span>
            ))}
          </div>
        </div>
      )}

      {charger.UsageType && (
        <p className="mt-4 text-xs text-slate-600">Access: {charger.UsageType.Title || "Check on-site"}</p>
      )}

      {(address.Latitude && address.Longitude) && (
        <button
          onClick={handleNavigate}
          className="mt-4 w-full rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
        >
          Navigate
        </button>
      )}
    </article>
  );
}
