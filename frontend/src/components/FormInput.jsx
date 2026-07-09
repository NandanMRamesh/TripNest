export default function FormInput({ label, as = 'input', className = '', error, ...props }) {
  const Element = as;
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <Element
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:ring-4 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
