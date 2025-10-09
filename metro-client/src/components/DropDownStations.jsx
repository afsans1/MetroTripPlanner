export default function DropDownStations({
  stations = [],
  station,
  onChange,
  label,
}) {
  return (
    <>
      <label>{label}</label>
      <select value={station} onChange={onChange}>
        <option value="" disabled>
          -- Select A Station --
        </option>
        {stations.map((s) => 
          <option key={s.name} value={s.name}>
            {s.name}
          </option>
        )}
      </select>
    </>
  );
}
