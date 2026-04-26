import { Plus, Settings2 } from "lucide-react";

const AdminCategories = () => {
  const categories = ["Development", "Design", "Business", "Marketing", "Cybersecurity"];
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <button className="bg-primary/20 text-primary border border-primary/20 px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat} className="p-4 bg-card border border-white/5 rounded-xl flex justify-between items-center group">
            <span className="font-semibold">{cat}</span>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 text-muted-foreground hover:text-white"><Settings2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminCategories;