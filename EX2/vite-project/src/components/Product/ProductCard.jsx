export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
      <div className="h-54 bg-slate-100 rounded mb-3 flex items-center justify-center text-slate-400">
        Image
      </div>
      <h4 className="font-semibold">{product.name}</h4>
      <p className="text-sm text-slate-600 line-clamp-2 text-start">
        {product.description}
      </p>
      <div className="mt-auto flex items-center justify-between">
        <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
        <button
          onClick={() => onAdd(product)}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}
