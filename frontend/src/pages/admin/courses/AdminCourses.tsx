import { Plus, Edit, Trash2, Eye } from "lucide-react";

const AdminCourses = () => {
  const courses = [
    { id: 1, name: "React for Beginners", instructor: "Sarah D.", status: "Published", sales: 124, price: "$49.00" },
    { id: 2, name: "Advanced UI Patterns", instructor: "James W.", status: "Draft", sales: 0, price: "$89.00" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90">
          <Plus size={18} /> Create New Course
        </button>
      </div>

      <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-bold">
            <tr>
              <th className="p-4">Course Name</th>
              <th className="p-4">Status</th>
              <th className="p-4">Sales</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium">{course.name}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${course.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    {course.status}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{course.sales}</td>
                <td className="p-4">{course.price}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button className="p-2 hover:bg-white/10 rounded"><Edit size={16}/></button>
                  <button className="p-2 hover:bg-red-500/10 text-red-500 rounded"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminCourses;