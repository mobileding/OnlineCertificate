'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Calendar, ChevronRight, BarChart3, PenTool, Share2, Award, Trophy } from 'lucide-react';

// --- DATA STRUCTURE: THE STRATEGY ---
const INITIAL_PLAN = [
  {
    id: 1,
    title: "The 'Academic' Sprint",
    focus: "Schools & Teachers",
    description: "Focus on high-volume search terms for K-12 and University use cases. Teachers need 'quick & bulk'.",
    icon: <SchoolIcon />, 
    progress: 0,
    tasks: [
      { id: 'w1-d1', day: 'Mon', type: 'Template', title: 'Honor Roll Certificate', keyword: 'free honor roll certificate template verifiable', status: 'pending' },
      { id: 'w1-d2', day: 'Tue', type: 'Blog', title: 'Guide: "Google Docs vs. Verified Records"', keyword: 'bulk certificate generator for schools', status: 'pending' },
      { id: 'w1-d3', day: 'Wed', type: 'Template', title: 'Perfect Attendance Award', keyword: 'perfect attendance award maker with qr code', status: 'pending' },
      { id: 'w1-d4', day: 'Thu', type: 'Template', title: 'Science Fair Winner', keyword: 'science fair certificate template free', status: 'pending' },
      { id: 'w1-d5', day: 'Fri', type: 'Template', title: 'Kindergarten Diploma', keyword: 'kindergarten graduation diploma maker', status: 'pending' },
      { id: 'w1-d6', day: 'Sat', type: 'Social', title: 'LinkedIn: "Stop giving students fake PDFs"', keyword: 'Showcase the Report Card design', status: 'pending' },
    ]
  },
  {
    id: 2,
    title: "The 'Non-Profit' Sprint",
    focus: "Volunteers & NGOs",
    description: "Targeting organizations that need to verify service hours for court or academic credit.",
    icon: <HeartIcon />,
    progress: 0,
    tasks: [
      { id: 'w2-d1', day: 'Mon', type: 'Template', title: 'Community Service Log', keyword: 'volunteer hour log sheet and certificate', status: 'pending' },
      { id: 'w2-d2', day: 'Tue', type: 'Blog', title: 'Guide: "Verifying Court-Ordered Service"', keyword: 'verify volunteer hours for court', status: 'pending' },
      { id: 'w2-d3', day: 'Wed', type: 'Template', title: 'Volunteer Appreciation', keyword: 'volunteer appreciation certificate template', status: 'pending' },
      { id: 'w2-d4', day: 'Thu', type: 'Template', title: 'Donor Recognition', keyword: 'donor recognition award wording', status: 'pending' },
      { id: 'w2-d5', day: 'Fri', type: 'Template', title: 'Board Member Service', keyword: 'board member service award template', status: 'pending' },
      { id: 'w2-d6', day: 'Sat', type: 'Social', title: 'Twitter/X: "Non-profits need data, not paper"', keyword: 'Tag TechSoup and major NGO accounts', status: 'pending' },
    ]
  },
  {
    id: 3,
    title: "The 'Skills & Training' Sprint",
    focus: "Bootcamps & Corporate",
    description: "High-value targets. These users are willing to pay for premium verification features.",
    icon: <BriefcaseIcon />,
    progress: 0,
    tasks: [
      { id: 'w3-d1', day: 'Mon', type: 'Template', title: 'First Aid / CPR Completion', keyword: 'cpr training certificate template', status: 'pending' },
      { id: 'w3-d2', day: 'Tue', type: 'Blog', title: 'Guide: "The LinkedIn Effect"', keyword: 'how to add certificate to linkedin', status: 'pending' },
      { id: 'w3-d3', day: 'Wed', type: 'Template', title: 'Coding Bootcamp Diploma', keyword: 'coding bootcamp certificate generator', status: 'pending' },
      { id: 'w3-d4', day: 'Thu', type: 'Template', title: 'Corporate Training Completion', keyword: 'employee training certificate format', status: 'pending' },
      { id: 'w3-d5', day: 'Fri', type: 'Template', title: 'Safety Compliance Award', keyword: 'osha safety award certificate', status: 'pending' },
      { id: 'w3-d6', day: 'Sat', type: 'Social', title: 'LinkedIn: "Your PDF is dead to recruiters"', keyword: 'Post a comparison: PDF vs. Your Live URL', status: 'pending' },
    ]
  },
  {
    id: 4,
    title: "Distribution & Outreach",
    focus: "Directories & Cold Email",
    description: "Moving from content creation to active promotion and link building.",
    icon: <MegaphoneIcon />,
    progress: 0,
    tasks: [
      { id: 'w4-d1', day: 'Mon', type: 'Outreach', title: 'Submit to TechSoup', keyword: 'Register as a service provider for non-profits', status: 'pending' },
      { id: 'w4-d2', day: 'Tue', type: 'Outreach', title: 'Submit to ProductHunt', keyword: 'Prepare launch materials for "The Report Card"', status: 'pending' },
      { id: 'w4-d3', day: 'Wed', type: 'Email', title: 'Cold Email: Bootcamp Instructors', keyword: 'Scrape LinkedIn for "Instructor" -> Send demo', status: 'pending' },
      { id: 'w4-d4', day: 'Thu', type: 'Email', title: 'Cold Email: Local Chambers of Commerce', keyword: 'Offer them a free "Member Verified" badge system', status: 'pending' },
      { id: 'w4-d5', day: 'Fri', type: 'Review', title: 'Analyze Traffic Data', keyword: 'Check Google Search Console for winning keywords', status: 'pending' },
      { id: 'w4-d6', day: 'Sat', type: 'Plan', title: 'Plan Next Month', keyword: 'Double down on the niche that worked best', status: 'pending' },
    ]
  }
];

// --- ICONS ---
function SchoolIcon() { return <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Trophy size={20} /></div> }
function HeartIcon() { return <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Award size={20} /></div> }
function BriefcaseIcon() { return <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><BarChart3 size={20} /></div> }
function MegaphoneIcon() { return <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Share2 size={20} /></div> }

// --- COMPONENT ---
export default function PushPlanDashboard() {
  const [weeks, setWeeks] = useState(INITIAL_PLAN);
  const [activeWeek, setActiveWeek] = useState(1);
  const [mounted, setMounted] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('certificate_push_plan');
    if (saved) {
      setWeeks(JSON.parse(saved));
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('certificate_push_plan', JSON.stringify(weeks));
    }
  }, [weeks, mounted]);

  const toggleTask = (weekId: number, taskId: string) => {
    setWeeks(currentWeeks => 
      currentWeeks.map(week => {
        if (week.id !== weekId) return week;
        
        const updatedTasks = week.tasks.map(task => 
          task.id === taskId 
            ? { ...task, status: task.status === 'done' ? 'pending' : 'done' }
            : task
        );
        
        // Recalculate progress
        const doneCount = updatedTasks.filter(t => t.status === 'done').length;
        const progress = Math.round((doneCount / updatedTasks.length) * 100);
        
        return { ...week, tasks: updatedTasks, progress };
      })
    );
  };

  const currentWeekData = weeks.find(w => w.id === activeWeek);

  // Calculate Total Progress
  const totalTasks = weeks.reduce((acc, w) => acc + w.tasks.length, 0);
  const completedTasks = weeks.reduce((acc, w) => acc + w.tasks.filter(t => t.status === 'done').length, 0);
  const totalProgress = Math.round((completedTasks / totalTasks) * 100);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
             <h1 className="text-3xl font-bold text-slate-900 mb-2">Content & SEO Push Plan</h1>
             <p className="text-slate-500">onlinecertificate.org • 4-Week Execution System</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 w-full md:w-auto">
            <div className="flex items-center gap-4 mb-2">
               <div className="text-xs font-bold text-slate-400 uppercase">Overall Progress</div>
               <div className="text-sm font-bold text-slate-900">{totalProgress}%</div>
            </div>
            <div className="w-full md:w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-slate-900 transition-all duration-500" style={{ width: `${totalProgress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: WEEK NAVIGATION */}
          <div className="lg:col-span-4 space-y-4">
            {weeks.map((week) => (
              <button
                key={week.id}
                onClick={() => setActiveWeek(week.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 group ${
                  activeWeek === week.id 
                    ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div>{week.icon}</div>
                <div className="flex-1">
                   <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold ${activeWeek === week.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                        Week {week.id}: {week.title.replace("The '", "").replace("' Sprint", "")}
                      </span>
                      {week.progress === 100 ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <span className="text-xs font-mono text-slate-400">{week.progress}%</span>
                      )}
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-500 ${week.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${week.progress}%` }}></div>
                   </div>
                </div>
              </button>
            ))}
            
            <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 mt-8">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                 <PenTool size={16} /> Quick Tips
              </h3>
              <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                 <li><strong>Templates:</strong> Focus on H1 tags. Use the "Keyword" provided in your title.</li>
                 <li><strong>Blogs:</strong> Internal link to at least 2 templates per post.</li>
                 <li><strong>Consistency:</strong> Do 1 task per day. Don't batch everything on Sunday.</li>
              </ul>
            </div>
          </div>

          {/* RIGHT: TASK LIST */}
          <div className="lg:col-span-8">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
                
                {/* Header for Active Week */}
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                   <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold uppercase rounded">Week {currentWeekData?.id}</span>
                      <h2 className="text-xl font-bold text-slate-900">{currentWeekData?.title}</h2>
                   </div>
                   <p className="text-slate-500">{currentWeekData?.description}</p>
                </div>

                {/* Tasks */}
                <div className="divide-y divide-slate-100">
                  {currentWeekData?.tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`p-6 transition-colors hover:bg-slate-50 flex gap-4 ${task.status === 'done' ? 'opacity-50' : ''}`}
                    >
                       <button 
                         onClick={() => toggleTask(currentWeekData.id, task.id)}
                         className="mt-1 flex-shrink-0"
                       >
                          {task.status === 'done' ? (
                            <CheckCircle className="text-green-500 w-6 h-6" />
                          ) : (
                            <Circle className="text-slate-300 w-6 h-6 hover:text-indigo-500 transition-colors" />
                          )}
                       </button>

                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                             <span className="font-mono text-xs font-bold text-slate-400 w-8">{task.day}</span>
                             <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                               task.type === 'Template' ? 'bg-purple-100 text-purple-700' :
                               task.type === 'Blog' ? 'bg-blue-100 text-blue-700' :
                               task.type === 'Social' ? 'bg-pink-100 text-pink-700' :
                               'bg-amber-100 text-amber-700'
                             }`}>
                                {task.type}
                             </span>
                          </div>
                          
                          <h3 className={`font-semibold text-lg ${task.status === 'done' ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800'}`}>
                            {task.title}
                          </h3>
                          
                          <div className="mt-1 flex items-start gap-1.5">
                             <span className="text-slate-400 text-xs uppercase font-bold mt-0.5">SEO Focus:</span>
                             <p className="text-sm text-slate-600 font-mono bg-slate-100 px-1.5 rounded inline-block">
                               {task.keyword}
                             </p>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
}