/**
 * This creates the drop down menus to pick the start and end stations
 * 
 * @param stations the station options
 * @param station the value of the selected station
 * @param onChange what happens when the value is changed
 * @param label the label name of the label tag
 * @returns DropDownStations component
 */
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
