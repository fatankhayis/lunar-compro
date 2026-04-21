// 📁 src/pages/Home/components/PartnershipPage.jsx
import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { getPartnerships } from '../../Admin/services/api';
import { BASE_URL } from '../../../url';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PartnershipPage = () => {
  const [groupedPartners, setGroupedPartners] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredPartner, setHoveredPartner] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const data = await getPartnerships();
        console.log("API DATA:", data);

        const mapped = data.map((p) => {
          // Category formatting
          let categoryName = p?.category?.name || p?.category || p?.category_name || "Other";

          // Image formatting
          let imageUrl = null;
          if (p.partner_image) {
            if (typeof p.partner_image === "string" && p.partner_image.startsWith("http")) {
              imageUrl = p.partner_image;
            } else {
              imageUrl = `${BASE_URL}/storage/${p.partner_image}`;
            }
          }

          return {
            id: p.partner_id || p.id,
            name: p.name,
            category: categoryName,
            image: imageUrl,
          };
        });

        const grouped = mapped.reduce((acc, partner) => {
          const key = partner.category || "Other";
          if (!acc[key]) acc[key] = [];
          acc[key].push(partner);
          return acc;
        }, {});

        setGroupedPartners(grouped);
      } catch (err) {
        console.error("Failed to load partnerships:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // SKELETON LOADING
  if (loading) {
    return (
      <div className="w-full py-16 flex flex-col gap-5">
        <h1 className="text-white text-center text-[28px] font-semibold">Our Partnership</h1>
        <div className="flex gap-6 justify-center py-4">
          {[1, 2, 3].map((x) => (
            <div key={x} className="flex flex-col items-center gap-3">
              <Skeleton width={150} height={70} />
              <Skeleton width={80} height={16} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // JIKA TIDAK ADA DATA
  if (Object.keys(groupedPartners).length === 0) {
    return <p className="text-center text-white py-20">No partnerships yet.</p>;
  }

  // Pisahkan "Schools" dan yang lain
  const schoolsGroups = Object.entries(groupedPartners).filter(
    ([cat]) => cat.toLowerCase() === "schools"
  );
  const otherGroups = Object.entries(groupedPartners).filter(
    ([cat]) => cat.toLowerCase() !== "schools"
  );

  // Duplicate untuk infinite marquee
  const loopOther = [...otherGroups, ...otherGroups];
  const loopSchools = [...schoolsGroups, ...schoolsGroups];

  const formatCategoryName = (name) =>
    name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="w-full py-16 lg:py-20 font-heading relative overflow-hidden">
      <h1 className="text-white text-center text-[28px] lg:text-[32px] font-semibold">
        Our Partnership
      </h1>

      {/* GRADIENT LEFT/RIGHT */}
      <div className="pointer-events-none absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-bg to-transparent z-10"></div>
      <div className="pointer-events-none absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-bg to-transparent z-10"></div>

      {/* OTHER PARTNERS */}
      {loopOther.length > 0 && (
          <Marquee gradient={false} speed={45} pauseOnHover={true}>
            <div className="flex items-center gap-0">
              {otherGroups.map(([category, partners], i) => (
                <div key={i} className="flex items-center gap-6 px-4 pt-14 pb-6">
                  {partners.map((p) => (
                    <div key={p.id} className="relative">
                      {/* TOOLTIP */}
                      <div
                        className={`absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-semibold px-3 py-2 rounded-md shadow-lg transition-all duration-300 ${
                          hoveredPartner === p.id
                            ? "opacity-100 visible scale-100"
                            : "opacity-0 invisible scale-95"
                        }`}
                      >
                        {formatCategoryName(category)}
                      </div>

                      {/* LOGO */}
                      <div
                        className="bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden h-[100px] w-[200px] cursor-pointer"
                        onMouseEnter={() => setHoveredPartner(p.id)}
                        onMouseLeave={() => setHoveredPartner(null)}
                      >
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="object-contain h-[70px] w-[150px]"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/150x70/6B7280/FFFFFF?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="text-gray-400">No Image</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Marquee>
      )}

      {/* SCHOOLS */}
      {loopSchools.length > 0 && (
        <>
          <h1 className="text-white text-center text-[26px] lg:text-[30px] font-semibold py-4">
            Schools Partnership
          </h1>

          <Marquee gradient={false} speed={45} pauseOnHover={true} direction="right">
            <div className="flex items-center gap-0">
              {schoolsGroups.map(([category, partners], i) => (
                <div key={i} className="flex items-center gap-6 px-4 pt-10 pb-6">
                  {partners.map((p) => (
                    <div key={p.id} className="relative">
                      {/* TOOLTIP */}
                      <div
                        className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-semibold px-3 py-2 rounded-md shadow-lg transition-all duration-300 ${
                          hoveredPartner === p.id
                            ? "opacity-100 visible scale-100"
                            : "opacity-0 invisible scale-95"
                        }`}
                      >
                        {formatCategoryName(category)}
                      </div>

                      {/* LOGO */}
                      <div
                        className="bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden h-[100px] w-[200px] cursor-pointer"
                        onMouseEnter={() => setHoveredPartner(p.id)}
                        onMouseLeave={() => setHoveredPartner(null)}
                      >
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="object-contain h-[70px] w-[150px]"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/150x70/6B7280/FFFFFF?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="text-gray-400">No Image</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Marquee>
        </>
      )}
    </div>
  );
};

export default PartnershipPage;
