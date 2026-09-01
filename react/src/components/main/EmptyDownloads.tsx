import DeleteFileIcon from "@src/assets/DeleteFileIcon"

const EmptyDownloads = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
      <DeleteFileIcon sx={{ fontSize: 70, color: "var(--color-neutral-500)" }} />
      <div className="text-neutral-500">No downloads found</div>
    </div>
  )
}

export default EmptyDownloads
