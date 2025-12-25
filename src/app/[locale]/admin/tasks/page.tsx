import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { CheckCircle, LayoutTemplate, FileText, RefreshCw, Trash2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { generateSeoMissions } from '../../actions/missions';
import { MissionGenerator } from '../../../components/MissionGenerator';

// --- ACTIONS ---

async function markComplete(formData: FormData) {
  "use server";
  const id = formData.get('id');
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );
  await supabase.from('seo_missions').update({ 
      status: 'completed',
      completed_at: new Date().toISOString() 
  }).eq('id', id);
  redirect('/admin/tasks');
}

async function deleteMission(formData: FormData) {
  "use server";
  const id = formData.get('id');
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );
  await supabase.from('seo_missions').delete().eq('id', id);
  redirect('/admin/tasks');
}

// --- PAGE COMPONENT ---

export default async function TaskDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  // 1. Get Newest 5 Pending Tasks (So you see what you just added)
  const { data: todaysTasks, count: pendingCount } = await supabase
    .from('seo_missions')
    .select('*', { count: 'exact' })
    .eq('status', 'pending')
    .order('created_at', { ascending: false }) // Newest first
    .limit(5);

  // 2. Analytics
  const { data: completed } = await supabase
    .from('seo_missions')
    .select('completed_at')
    .eq('status', 'completed');

  const totalCompleted = completed?.length || 0;
  
  const now = new Date();
  // Week Calculation
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); 
  const completedThisWeek = completed?.filter(t => new Date(t.completed_at) >= startOfWeek).length || 0;
  
  // Month Calculation
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const completedThisMonth = completed?.filter(t => new Date(t.completed_at) >= startOfMonth).length || 0;

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER & CONTROLS */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Mission Control</h1>
                <p className="text-slate-500">
                    <span className="font-bold text-slate-700">{pendingCount}</span> targets waiting in the backlog.
                </p>
            </div>
            
            {/* NEW: AI GENERATE BUTTON */}
            <MissionGenerator />
        </div>

        {/* PROGRESS DASHBOARD (Week / Month / Lifetime) */}
        <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">This Week</p>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-green-600">+{completedThisWeek}</p>
                </div>
                <p className="text-xs text-slate-400">Current Velocity</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">This Month</p>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-blue-600">+{completedThisMonth}</p>
                </div>
                <p className="text-xs text-slate-400">Consistency</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lifetime</p>
                <p className="text-3xl font-bold text-slate-900">{totalCompleted}</p>
                <p className="text-xs text-slate-400">Total Pages</p>
            </div>
        </div>

        {/* TASK LIST */}
        <div className="space-y-4">
            {(!todaysTasks || todaysTasks.length === 0) && (
                <div className="text-center p-12 text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
                    All caught up! Use the generator to find new targets.
                </div>
            )}

            {todaysTasks?.map((task: any) => (
                <div key={task.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:border-blue-300 transition-all">
                    
                    {/* Left: The Target */}
                    <div className="flex-1">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
                            {task.category || 'General'}
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 mt-2">"{task.keyword}"</h2>
                    </div>

                    {/* Middle: The Actions */}
                    <div className="flex gap-3">
                        <Link 
                            href={`/admin/blog?keyword=${encodeURIComponent(task.keyword)}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                            <FileText size={16} /> Blog Post
                        </Link>
                        <Link 
                            href={`/admin/seotemplate?keyword=${encodeURIComponent(task.keyword)}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 hover:text-purple-600 transition-colors"
                        >
                            <LayoutTemplate size={16} /> Landing Page
                        </Link>
                    </div>

                    {/* Right: Complete or Delete */}
                    <div className="border-l pl-4 border-slate-100 flex items-center gap-2">
                        <form action={markComplete as any}>
                            <input type="hidden" name="id" value={task.id} />
                            <button type="submit" className="text-slate-300 hover:text-green-600 transition-colors p-1" title="Mark Complete">
                                <CheckCircle size={28} />
                            </button>
                        </form>

                        <form action={deleteMission as any}>
                            <input type="hidden" name="id" value={task.id} />
                            <button type="submit" className="text-slate-200 hover:text-red-500 transition-colors p-1" title="Reject Mission">
                                <Trash2 size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Refresh Button (Optional if you want to see older tasks) */}
        {pendingCount && pendingCount > 5 && (
            <div className="mt-8 text-center">
                <button className="text-slate-400 hover:text-slate-600 flex items-center gap-2 mx-auto text-sm">
                    <RefreshCw size={14} /> View Next Batch
                </button>
            </div>
        )}

      </div>
    </main>
  );
}