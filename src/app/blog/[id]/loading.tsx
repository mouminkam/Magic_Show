import SectionSkeleton from "@/components/ui/SectionSkeleton";

export default function BlogPostLoading() {
  return (
    <div className="bg-surface min-h-screen">
      <div className="h-80 md:h-[28rem] lg:h-[32rem] w-full skeleton" />
      <div className="container mx-auto px-4">
        <SectionSkeleton variant="default" height="h-96" />
      </div>
    </div>
  );
}
