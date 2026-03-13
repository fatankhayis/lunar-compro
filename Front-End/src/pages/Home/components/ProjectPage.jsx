import React, { useState, useEffect } from "react";
import CardProject from "./CardProject";
import { getProjects } from "../../Admin/services/api";
import { BASE_URL } from "../../../url";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();

        // 🔹 Tampilkan hanya project dengan order_by 1,2,3
        const filtered = data
          .filter((p) => [1, 2, 3].includes(Number(p.order_by)))
          .sort((a, b) => a.order_by - b.order_by);

        setProjects(filtered);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat project");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="relative py-28 w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center"></div>

      <div className="relative max-w-full px-5 mx-auto flex flex-col gap-10">
        <h1 className="font-semibold font-heading text-[24px] md:text-[28px] lg:text-[31px] xl:text-[33px] text-white text-center">
          Our Project
        </h1>

        {/* 🔸 Error message */}
        {error && <p className="text-center text-white">{error}</p>}

        {/* 🔸 Grid Project Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 
          px-5 md:px-8 lg:px-0 mx-auto gap-10 justify-items-center"
        >
          {/*  Skeleton saat loading */}
          {loading &&
            Array(3)
              .fill()
              .map((_, i) => <CardProject key={i} loading={true} />)}

          {!loading &&
            projects.map((project) => (
              
              <CardProject
                key={project.project_id}
                title={project.title}
                description={project.description}
                image={
                  project.project_image
                    ? `${BASE_URL}/storage/${project.project_image}`
                    : "/placeholder.png"
                }
                link={project.link}
              />
            ))}
        </div>

        {/* 🔸 More Project button */}
        {!loading && !error && (
          <div className="text-center mt-10">
            <a
              href="/Project"
              className="inline-block px-5 py-2 rounded-xl border border-white/30 
              bg-white/15 backdrop-blur-md text-white
              hover:bg-white/25 hover:shadow-lg active:bg-white/30
              transition-all duration-300 group"
            >
              More Project
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
