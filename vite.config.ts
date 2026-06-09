import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

/**
 * Vite configuration for the resume builder.
 * Configures React plugin, Tailwind CSS v4 plugin, and path alias for clean imports.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replaceAll('\\', '/');

          if (!normalizedId.includes('/node_modules/')) {
            return;
          }

          if (
            normalizedId.includes('/react/') ||
            normalizedId.includes('/react-dom/') ||
            normalizedId.includes('/scheduler/')
          ) {
            return 'vendor-react';
          }

          if (
            normalizedId.includes('/react-hook-form/') ||
            normalizedId.includes('/@hookform/') ||
            normalizedId.includes('/zod/') ||
            normalizedId.includes('/react-day-picker/') ||
            normalizedId.includes('/date-fns/')
          ) {
            return 'vendor-forms';
          }

          if (
            normalizedId.includes('/radix-ui/') ||
            normalizedId.includes('/lucide-react/')
          ) {
            return 'vendor-ui';
          }

          if (
            normalizedId.includes('/docx/') ||
            normalizedId.includes('/pako/')
          ) {
            return 'vendor-docx';
          }

          if (
            normalizedId.includes('/@react-pdf/renderer/') ||
            normalizedId.includes('/@react-pdf/render/') ||
            normalizedId.includes('/@react-pdf/reconciler/')
          ) {
            return 'vendor-pdf-render';
          }

          if (
            normalizedId.includes('/@react-pdf/layout/') ||
            normalizedId.includes('/@react-pdf/stylesheet/') ||
            normalizedId.includes('/@react-pdf/textkit/')
          ) {
            return 'vendor-pdf-layout';
          }

          if (normalizedId.includes('/@react-pdf/pdfkit/')) {
            return 'vendor-pdf-kit';
          }

          if (normalizedId.includes('/fontkit/')) {
            return 'vendor-fontkit';
          }

          if (
            normalizedId.includes('/@react-pdf/') ||
            normalizedId.includes('/yoga-layout/') ||
            normalizedId.includes('/png-js/')
          ) {
            return 'vendor-pdf-support';
          }

          return 'vendor';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
