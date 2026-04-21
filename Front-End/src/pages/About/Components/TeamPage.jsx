import React, { useEffect, useState } from "react";
import CardTeam from "./CardTeam";
import { getCrew } from "../../Admin/services/api";
import { BASE_URL } from "../../../url";

const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white/10 rounded-xl p-4 flex flex-col items-center gap-4 h-[260px]">
      <div className="w-28 h-28 bg-white/20 rounded-full" />
      <div className="w-40 h-4 bg-white/20 rounded-md" />
      <div className="w-28 h-3 bg-white/20 rounded-md" />
    </div>
  );
};

const TeamPage = () => {
  const [crewList, setCrewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrew = async () => {
      try {
        setLoading(true);

        const res = await getCrew();

        console.log("🔥 API RESULT:", res);

        // otomatis nge-handle semua kemungkinan bentuk response
        const list =
          Array.isArray(res)
            ? res
            : res?.data ??
              res?.crew ??
              res?.list ??
              res?.result ??
              [];

        // kalau list masih bukan array → jadikan array kosong
        const safeList = Array.isArray(list) ? list : [];

        const sorted = safeList.sort(
          (a, b) => (a.order_by ?? 999) - (b.order_by ?? 999)
        );

        setCrewList(sorted);
      } catch (err) {
        console.error("❌ Failed to load crew:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCrew();
  }, []);

  return (
    <div className="py-20 px-4 sm:px-6 md:px-12 lg:px-18 xl-px-20">
      {/* Judul statis */}
      <h2 className="font-semibold font-heading text-[24px] md:text-[28px] lg:text-[32px] text-white text-center mb-10">
        Let’s meet our crew!
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 md:gap-y-6 gap-x-8">
        {loading ? (
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : crewList.length === 0 ? (
          <p className="text-white text-center col-span-3">No data found.</p>
        ) : (
          crewList.map((member, index) => (
            <div
              key={index}
              className="animate-fadeIn"
              style={{
                animationDelay: `${index * 0.15}s`,
              }}
            >
              <CardTeam
                name={member.name}
                title={member.title}
                role={member.role}
                image={
                  member.crew_image
                    ? `${BASE_URL}/storage/${member.crew_image}`
                    : "/default-avatar.png"
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamPage;
