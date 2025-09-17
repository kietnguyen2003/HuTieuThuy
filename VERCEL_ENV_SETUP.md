# Vercel Environment Variables Setup

## Environment Variables cần thiết cho Vercel:

### 1. Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Revalidation Secret (MỚI)
```
REVALIDATE_SECRET=your_random_secret_string_here
```

### 3. Next Auth URL (cho production)
```
NEXTAUTH_URL=https://your-vercel-app-domain.vercel.app
```

## Cách thêm Environment Variables trong Vercel:

1. Vào Vercel Dashboard
2. Chọn project của bạn
3. Vào tab "Settings"
4. Chọn "Environment Variables"
5. Thêm từng biến môi trường ở trên

## Lưu ý về Image Caching:

Sau khi cập nhật environment variables, hãy:
1. Redeploy project
2. Test thay đổi ảnh chính trong admin
3. Kiểm tra xem ảnh có cập nhật trên trang sản phẩm không

## Troubleshooting:

Nếu ảnh vẫn không cập nhật:
1. Kiểm tra Vercel Function logs
2. Thử clear cache bằng cách gọi `/api/revalidate` manually
3. Kiểm tra Supabase storage permissions