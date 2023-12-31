"use client";

/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/GR8nJIP95Bf
 */
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { gql } from "@/app/__generated__";
import { useMutation, useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  // https://github.com/shadcn-ui/ui/issues/800#issuecomment-1717240139
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

const GET_POST = gql(/* GraphQL */ `
  query GetPost($id: Int!) {
    post(id: $id) {
      title
      body
      author {
        name
      }
      comments {
        id
        name
        email
        body
      }
    }
  }
`);

const CREATE_COMMENT = gql(/* GraphQL */ `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      comment {
        id
        name
        email
        body
      }
    }
  }
`);

const DELETE_POST = gql(/* GraphQL */ `
  mutation DeletePost($input: DeletePostInput!) {
    deletePost(input: $input) {
      post {
        id
        userId
      }
    }
  }
`);

export default function PostDetailPage() {
  const { postId } = useParams();
  const router = useRouter();

  const { toast } = useToast();

  const { data, refetch } = useQuery(GET_POST, {
    variables: {
      id: Number(postId),
    },
  });

  const [deletePost, deletePostMutation] = useMutation(DELETE_POST, {
    variables: {
      input: {
        id: Number(postId),
      },
    },
    onCompleted(data) {
      if (data.deletePost.post) {
        router.replace(`/users/${data.deletePost.post.userId}`);
      }
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
  });

  const [createComment] = useMutation(CREATE_COMMENT);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      comment: "",
    },
  });

  return (
    <div className="p-4 md:p-6">
      <article className="space-y-6">
        <header>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            {data?.post?.title}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Posted by {data?.post?.author?.name}
            <Button
              variant="link"
              loading={deletePostMutation.loading}
              onClick={() => deletePost()}
            >
              Delete
            </Button>
          </p>
        </header>
        <section>
          <p>{data?.post?.body}</p>
        </section>
      </article>
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Comments</h2>
        <Form {...form}>
          <form
            className="space-y-2 mt-4"
            onSubmit={form.handleSubmit(async ({ name, email, comment }) => {
              await createComment({
                variables: {
                  input: {
                    postId: Number(postId),
                    name,
                    email,
                    body: comment,
                  },
                },
              });
              refetch();
              form.reset();
            })}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Your Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        id="comment"
                        placeholder="Add a comment..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <Button
                  className="bg-gray-800 text-white py-2 px-4 rounded"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
        <div className="mt-8 space-y-4">
          {data?.post?.comments.map((comment) => (
            <div key={comment.id}>
              <p className="text-lg font-semibold">{comment.name}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {comment.email}
              </p>
              <p>{comment.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
