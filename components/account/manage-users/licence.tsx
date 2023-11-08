const licences = 9; // This needs to be passed from the template
const usedLicences = 8;

const Toolbar = () => (
  <div className="ml-10 mt-16">
    <div className="mb-8">
      <h3 className="text-2xl font-semibold mb-6">Number of user licences</h3>
      <p className="text-sm mb-1">
        Total number of licences: <span className="font-bold">{licences}</span>
      </p>
      <p className="text-sm mb-1">
        Total number used: <span className="font-bold">{usedLicences}</span>
      </p>
    </div>
    <div className="mt-4">
      <button
        className="inline-flex items-center rounded-md border border-transparent bg-primary-orange px-11 py-3 text-sm font-medium
        leading-4 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset- 1"
      >
        Add Licences
      </button>
    </div>
  </div>
);

export default Toolbar;
