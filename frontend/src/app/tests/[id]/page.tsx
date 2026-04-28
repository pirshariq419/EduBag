"use client";
import { useEffect, useState, use } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "@/store/toastStore";
import { Clock, CheckCircle2, XCircle, AlertCircle, Play, FileText, ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  _id: string;
  questionText: string;
  options: string[];
  // only present in analysis mode
  correctAnswerIndex?: number;
  explanation?: string;
}

interface Test {
  _id: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
}

interface Result {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  answers: number[];
}

export default function TestTakingPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Test State: 'instructions' | 'active' | 'submitting' | 'analysis'
  const [testState, setTestState] = useState<'instructions'|'active'|'submitting'|'analysis'>('instructions');
  
  // Active Test State
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);

  // Analysis State
  const [result, setResult] = useState<Result | null>(null);
  const [fullTest, setFullTest] = useState<Test | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get(`/tests/${unwrappedParams.id}`);
        const t = res.data.data;
        setTest(t);
        setAnswers(new Array(t.questions.length).fill(-1));
        setTimeLeft(t.durationMinutes * 60);
      } catch (err) {
        toast.error("Failed to load test. You may need to log in.");
        router.push("/tests");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [unwrappedParams.id, router]);

  // Timer logic
  useEffect(() => {
    if (testState === 'active' && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (testState === 'active' && timeLeft <= 0) {
      handleSubmitTest(); // Auto submit
    }
  }, [testState, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = optIndex;
    setAnswers(newAnswers);
  };

  const handleSubmitTest = async () => {
    if (testState !== 'active') return;
    setTestState('submitting');
    try {
      const res = await api.post(`/tests/${unwrappedParams.id}/submit`, { answers });
      setResult(res.data.data.result);
      setFullTest(res.data.data.test);
      setTestState('analysis');
    } catch (err) {
      toast.error("Failed to submit test. Please try again.");
      setTestState('active');
    }
  };

  if (loading || !test) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Topbar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="font-black text-slate-900 dark:text-white leading-tight">{test.title}</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{test.questions.length} Questions</p>
          </div>
        </div>

        {testState === 'active' && (
          <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">
            <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
            <span className={`font-black text-xl tracking-wider ${timeLeft < 300 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {testState === 'instructions' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200 dark:border-white/10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-black mb-6">Instructions</h2>
            <ul className="space-y-4 mb-10 text-slate-600 dark:text-slate-400 font-medium">
              <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> The test contains {test.questions.length} multiple-choice questions.</li>
              <li className="flex items-start gap-3"><Clock className="w-6 h-6 text-indigo-500 shrink-0" /> You have {test.durationMinutes} minutes to complete the test.</li>
              <li className="flex items-start gap-3"><AlertCircle className="w-6 h-6 text-amber-500 shrink-0" /> The test will auto-submit when the timer reaches zero.</li>
              <li className="flex items-start gap-3"><XCircle className="w-6 h-6 text-red-500 shrink-0" /> Do not refresh the page, or your progress will be lost.</li>
            </ul>
            <button onClick={() => setTestState('active')} className="w-full py-5 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1">
              <Play className="w-5 h-5" fill="currentColor" /> Start Test Now
            </button>
          </motion.div>
        )}

        {testState === 'active' && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Question Area */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                <span className="font-black text-lg text-slate-900 dark:text-white">Question {currentQ + 1}</span>
                <span className="text-sm font-bold text-slate-500">of {test.questions.length}</span>
              </div>
              
              <div className="p-8 flex-1 overflow-y-auto">
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-8">
                  {test.questions[currentQ].questionText}
                </h3>
                
                <div className="space-y-4">
                  {test.questions[currentQ].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full text-left px-6 py-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                        answers[currentQ] === i 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:border-indigo-500' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[currentQ] === i ? 'border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`}>
                        {answers[currentQ] === i && <div className="w-3 h-3 rounded-full bg-indigo-600" />}
                      </div>
                      <span className={`font-medium ${answers[currentQ] === i ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300'}`}>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-8 py-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50 flex justify-between">
                <button 
                  onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                  disabled={currentQ === 0}
                  className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button 
                  onClick={() => setCurrentQ(Math.min(test.questions.length - 1, currentQ + 1))}
                  disabled={currentQ === test.questions.length - 1}
                  className="px-8 py-3 rounded-xl font-bold flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                >
                  Save & Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sidebar Palette */}
            <div className="w-full lg:w-80 bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-200 dark:border-white/10 h-fit">
              <h3 className="font-black text-slate-900 dark:text-white mb-4">Question Palette</h3>
              <div className="grid grid-cols-5 gap-2 mb-8">
                {test.questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={`aspect-square rounded-xl font-bold text-sm transition-all ${
                      currentQ === i 
                      ? 'ring-2 ring-offset-2 ring-indigo-600 bg-indigo-600 text-white' 
                      : answers[i] !== -1 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="space-y-3 mb-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-md bg-emerald-100 border border-emerald-200" /> Answered ({answers.filter(a => a !== -1).length})</div>
                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-md bg-slate-100 border border-slate-200" /> Not Answered ({answers.filter(a => a === -1).length})</div>
              </div>
              <button onClick={() => {
                if(confirm("Are you sure you want to submit the test?")) handleSubmitTest();
              }} className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-slate-200 dark:shadow-none">
                Submit Test
              </button>
            </div>
          </div>
        )}

        {testState === 'submitting' && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6" />
            <h2 className="text-2xl font-black animate-pulse">Evaluating your test...</h2>
          </div>
        )}

        {testState === 'analysis' && result && fullTest && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Score Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                  <BarChart3 className="w-4 h-4" /> Performance Analysis
                </div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">You scored {result.score} out of {result.totalQuestions}</h2>
                <p className="text-slate-500 font-medium">Accuracy: {((result.correctAnswers / (result.totalQuestions - result.skippedQuestions)) * 100 || 0).toFixed(0)}%</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-2xl text-center min-w-[100px]">
                  <div className="text-3xl font-black text-emerald-600 mb-1">{result.correctAnswers}</div>
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Correct</div>
                </div>
                <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-2xl text-center min-w-[100px]">
                  <div className="text-3xl font-black text-red-600 mb-1">{result.wrongAnswers}</div>
                  <div className="text-xs font-bold text-red-600 uppercase tracking-widest">Wrong</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl text-center min-w-[100px]">
                  <div className="text-3xl font-black text-slate-600 dark:text-slate-300 mb-1">{result.skippedQuestions}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Skipped</div>
                </div>
              </div>
            </div>

            {/* Detailed Solutions */}
            <h3 className="text-2xl font-black px-2">Detailed Solutions</h3>
            <div className="space-y-6">
              {fullTest.questions.map((q, i) => {
                const isSkipped = result.answers[i] === -1;
                const isCorrect = result.answers[i] === q.correctAnswerIndex;
                
                return (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-2 h-full ${isSkipped ? 'bg-slate-300' : isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-bold text-slate-500 uppercase tracking-widest text-xs">Question {i + 1}</h4>
                      {isSkipped ? (
                         <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Skipped</span>
                      ) : isCorrect ? (
                         <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Correct</span>
                      ) : (
                         <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/> Incorrect</span>
                      )}
                    </div>
                    
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-6">{q.questionText}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {q.options.map((opt, optIndex) => {
                        let styling = "border-slate-200 text-slate-600 bg-slate-50";
                        if (optIndex === q.correctAnswerIndex) {
                          styling = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold";
                        } else if (optIndex === result.answers[i]) {
                          styling = "border-red-500 bg-red-50 text-red-800";
                        }
                        return (
                          <div key={optIndex} className={`p-4 rounded-xl border-2 ${styling}`}>
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="mt-6 p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                        <h5 className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Explanation</h5>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-center pt-8 pb-20">
              <button onClick={() => router.push("/tests")} className="px-8 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-105 transition-transform shadow-xl">
                Return to Mock Tests
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
