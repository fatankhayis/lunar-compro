<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class ImageService
{
    /**
     * Upload, convert ke WebP, dan compress otomatis.
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $folder
     * @param int $quality
     * @return string path gambar di storage
     */
    public static function uploadAndCompressToWebp($file, $folder = 'uploads', $quality = 75)
    {
        $filename = time() . '_' . Str::random(10) . '.webp';

        // Baca gambar & encode ke WebP
        $image = Image::read($file->getRealPath())
            ->encodeByExtension('webp', quality: $quality);

        // Simpan hasil ke storage/public/{folder}
        $path = $folder . '/' . $filename;
        Storage::disk('public')->put($path, (string) $image);

        return $path;
    }
}
