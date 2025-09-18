import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange
}) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  const removeFile = (index) => {
    setFiles((prev) => {
      const next = [...prev]
      next.splice(index, 1)
      onChange && onChange(next)
      return next
    })
  }

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className={cn(
          "group/file block cursor-pointer w-full relative overflow-hidden",
          // Glassmorphism card
          "rounded-2xl p-6 md:p-8 border border-white/10 dark:border-white/10",
          "bg-white/6 dark:bg-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
        )}
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden" />
        <div
          className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p
            className="relative z-20 font-sans font-semibold text-neutral-800 dark:text-neutral-100 text-base">
            Upload file
          </p>
          <p
            className="relative z-20 font-sans font-normal text-neutral-500 dark:text-neutral-300 text-sm mt-2">
            Drag & drop a file here, or click to browse
          </p>
          <div className="relative w-full mt-6 md:mt-8 max-w-2xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto",
                    "rounded-xl border border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
                  )}>
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-neutral-900 dark:text-neutral-100 truncate max-w-xs">
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-md px-2 py-1 w-fit shrink-0 text-xs md:text-sm text-neutral-700 dark:text-white bg-white/20 border border-white/10">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>

                  <div
                    className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-300">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-1.5 py-0.5 rounded-md bg-white/20 border border-white/10 text-neutral-800 dark:text-neutral-200">
                      {file.type}
                    </motion.p>

                    <div className="flex items-center gap-3">
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
                        modified {new Date(file.lastModified).toLocaleDateString()}
                      </motion.p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeFile(idx) }}
                        className="text-xs px-2 py-1 rounded-md bg-red-500/80 hover:bg-red-500 text-white border border-white/10"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative z-40 flex items-center justify-center h-36 md:h-40 mt-4 w-full mx-auto",
                  "rounded-xl border border-dashed border-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-lg",
                  "shadow-[0px_10px_40px_rgba(0,0,0,0.25)] group-hover/file:shadow-2xl"
                )}>
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-200 flex flex-col items-center">
                    Drop it
                    <IconUpload className="h-5 w-5 text-white/90" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-5 w-5 text-white/80" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute inset-0 z-30 pointer-events-none h-36 md:h-40 mt-4 w-full mx-auto rounded-xl"></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div
      className="flex bg-transparent dark:bg-transparent shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-white/5"
                  : "bg-white/8 shadow-[0px_0px_1px_3px_rgba(255,255,255,0.2)_inset]"
              }`} />
          );
        }))}
    </div>
  );
}
