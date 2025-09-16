import { supabase } from "./supabase";

export async function fetchXuongImage() {
  const listXuong = ['xuong-1.jpg', 'xuong-2.jpg', 'xuong-3.jpg', 'xuong-4.jpg', 'xuong-5.jpg'];
  const listDescription = ["Không gian ấm cúng", "Đầu bếp chuyên nghiệp", "Phục vụ tận tình", "Thực phẩm sạch sẽ", "Không gian sang trọng", "Phục vụ vui vẻ"];
  
  const imageXuongWithUrls = listXuong.map((image) => {
    const { data } = supabase.storage.from('hutieu').getPublicUrl(image);
    return {
      image,
      publicUrl: data.publicUrl || `/placeholder.svg?height=300&width=300`,
      description: listDescription[listXuong.indexOf(image)] || "Mô tả không có sẵn",
    };
  });
  return imageXuongWithUrls;
}