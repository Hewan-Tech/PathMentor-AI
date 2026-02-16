import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
import { useState } from "react";

const roadmapLevels = [
  {
    level: 1,
    name: "Awareness",
    description: "Discover the field and understand what's possible",
    status: "completed",
    modules: 8,
    completedModules: 8,
    lessons: ["Introduction to the Field", "Core Concepts Overview", "Tools & Environment Setup", "First Project Walkthrough"],
  },
  {
    level: 2,
    name: "Beginner",
    description: "Build your foundational knowledge and essential skills",
    status: "completed",
    modules: 12,
    completedModules: 12,
    lessons: ["Basic Syntax & Structures", "Control Flow", "Functions & Modules", "Data Types Deep Dive"],
  },
  {
    level: 3,
    name: "Fundamental",
    description: "Strengthen core principles and best practices",
    status: "current",
    modules: 15,
    completedModules: 10,
    lessons: ["Object-Oriented Concepts", "Error Handling", "Testing Basics", "Code Organization"],
  },
  {
    level: 4,
    name: "Intermediate",
    description: "Apply knowledge to real-world scenarios and projects",
    status: "locked",
    modules: 18,
    completedModules: 0,
    lessons: ["Advanced Patterns", "API Integration", "State Management", "Performance Basics"],
  },
  {
    level: 5,
    name: "Advanced",
    description: "Master complex architectures and optimization",
    status: "locked",
    modules: 20,
    completedModules: 0,
    lessons: ["System Design", "Scalability", "Security Best Practices", "Advanced Optimization"],
  },
  {
    level: 6,
    name: "Proficient",
    description: "Work on industry-grade projects and lead teams",
    status: "locked",
    modules: 15,
    completedModules: 0,
    lessons: ["Team Collaboration", "Code Reviews", "CI/CD Pipelines", "Production Deployment"],
  },
  {
    level: 7,
    name: "Mastery",
    description: "Achieve expert status and mentor others",
    status: "locked",
    modules: 10,
    completedModules: 0,
    lessons: ["Mentorship Skills", "Technical Leadership", "Open Source Contribution", "Speaking & Writing"],
  },
];

const Roadmap = () => {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(3);

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />

      {/* Header */}
      <header className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Your Learning <span className="text-gradient">Roadmap</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Progress through 7 carefully designed levels to transform from beginner to industry expert.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Roadmap content */}
      <main className="relative z-10 p-4 pt-8 pb-24">
        <div className="max-w-4xl mx-auto">
          {roadmapLevels.map((level, index) => (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector */}
              {index < roadmapLevels.length - 1 && (
                <div className="absolute left-8 top-full w-0.5 h-6 bg-gradient-to-b from-primary/50 to-transparent z-0" />
              )}

              <GlassCard
                className={`mb-6 overflow-hidden ${level.status === "locked" ? "opacity-60" : ""}`}
                hover={level.status !== "locked"}
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => level.status !== "locked" && setExpandedLevel(expandedLevel === level.level ? null : level.level)}
                >
                  <div className="flex items-start gap-4">
                    {/* Level indicator */}
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        level.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : level.status === "current"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {level.status === "completed" ? (
                        <Check className="w-8 h-8" />
                      ) : level.status === "locked" ? (
                        <Lock className="w-6 h-6" />
                      ) : (
                        <Star className="w-8 h-8" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-primary font-medium">Level {level.level}</span>
                        {level.status === "current" && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                            In Progress
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{level.name}</h3>
                      <p className="text-muted-foreground mb-4">{level.description}</p>

                      {/* Progress */}
                      {level.status !== "locked" && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">
                              {level.completedModules} of {level.modules} modules
                            </span>
                            <span className="text-primary">
                              {Math.round((level.completedModules / level.modules) * 100)}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-primary to-secondary"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(level.completedModules / level.modules) * 100}%`,
                              }}
                              transition={{ duration: 1, delay: 0.3 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expand icon */}
                    {level.status !== "locked" && (
                      <div className="flex-shrink-0">
                        {expandedLevel === level.level ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded lessons */}
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedLevel === level.level ? "auto" : 0,
                    opacity: expandedLevel === level.level ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2 border-t border-white/10">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Lessons</h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {level.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson}
                          className={`p-3 rounded-lg glass-inner-glow flex items-center gap-2 ${
                            level.status === "completed" || (level.status === "current" && lessonIndex < 3)
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {level.status === "completed" || (level.status === "current" && lessonIndex < 3) ? (
                            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-muted-foreground flex-shrink-0" />
                          )}
                          <span className="text-sm">{lesson}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Roadmap;
