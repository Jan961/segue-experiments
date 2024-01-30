
const Toolbar = () => (
  <div>
    <div className="flex flex-row items-center text-primary-green justify-evenly mt-5 h-50 max-w-full bg-transparent">
      <div className=" w-1/12">
        <button className={' w-100 bg-primary-green text-white rounded-md p-4 whitespace-nowrap'}>Add Activity</button>
      </div>

      <select>
        <option>Type</option>
      </select>
      <label htmlFor={'date'}>Date</label>
      <input type={'date'} />
      <label htmlFor={'date'}>TO</label>
      <input type={'date'} />
      <label htmlFor={'venue Code'}>Date</label>
      <input type={'text'} />
      <input type={'checkbox'} />
      <label className="text-center font-bold" htmlFor={'venue Code'}>
        Display current production activities only
      </label>
    </div>
  </div>
);

export default Toolbar;
