import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CardProject from "./CardProject";
import { getProjects } from "../../Admin/services/api";

gsap.registerPlugin(ScrollTrigger);

const ProjectPage = () => {
  const cardsRef = useRef([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const animationCreated = useRef(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();

        // 🔥 Perbaikan utama: memastikan hasil API benar-benar berupa array
        const result = Array.isArray(data)
          ? data
          : data?.projects || data?.data || [];

        setProjects(result);
      } catch (err) {
        console.error("Failed to load projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!loading && projects.length > 0 && !animationCreated.current) {
      animationCreated.current = true;
      
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "bottom 60%",
              toggleActions: "play none none none",
              once: true
            },
          }
        );
      });
    }
  }, [projects, loading]);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const ProjectSkeleton = () => (
    <div className="w-full flex justify-center items-center px-5">
      <div className="relative rounded-xl overflow-hidden shadow-2xl h-[480px] w-full max-w-[1420px] animate-pulse">
        <div className="absolute inset-0 bg-gray-700"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300/80 to-gray-200/60"></div>
        <div className="absolute top-6 left-6 z-20 max-w-lg space-y-4">
          <div className="h-10 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
        <div className="absolute bottom-6 left-6 z-20">
          <div className="h-12 w-32 bg-gray-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative py-28 w-full overflow-hidden">
      <div className="relative max-w-[2000px] px-10 mx-auto flex flex-col gap-10">
        <h1 className="font-semibold font-heading text-[24px] md:text-[28px] lg:text-[32px] text-white text-center">
          Our Project
        </h1>

        <div className="grid grid-cols-1 gap-16">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <ProjectSkeleton key={index} />
            ))
          ) : projects.length > 0 ? (
            projects.map((project, i) => (
              <div
                key={project.id || project.project_id || i} // 🔥 Fix key
                ref={(el) => (cardsRef.current[i] = el)}
              >
                <CardProject project={project} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300">No projects available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
