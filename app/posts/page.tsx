import { PostsBrowser } from "app/components/post-list";
import { getPostListItems } from "app/posts/utils";

export const metadata = {
  title: "Posts",
  description: "",
};

export default function Page() {
  const posts = getPostListItems();

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-normal">
        پۆستەکان
      </h1>
      {/* Placeholder intro: replace with your own. */}
      <p dir="ltr" className="mb-4 text-sm text-right">
        
      </p>
      <p dir="rtl" className="mb-4 text-sm text-right">
        کۆمەڵێک پۆست
      </p>
      <div className="my-8">
        <PostsBrowser posts={posts} />
      </div>
    </section>
  );
}
