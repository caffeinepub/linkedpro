import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type CommentId = bigint;
export type Time = bigint;
export interface Comment {
    id: CommentId;
    content: string;
    author: Principal;
    timestamp: Time;
}
export type MessageId = bigint;
export type PostId = bigint;
export interface Post {
    id: PostId;
    content: string;
    author: Principal;
    likes: Array<Principal>;
    timestamp: Time;
    comments: Array<Comment>;
}
export interface Message {
    id: MessageId;
    content: string;
    sender: Principal;
    timestamp: Time;
    receiver: Principal;
}
export type JobId = bigint;
export interface JobListing {
    id: JobId;
    title: string;
    description: string;
    company: string;
    requirements: Array<string>;
    location: string;
    poster: Principal;
}
export interface Profile {
    principal: Principal;
    headline: string;
    name: string;
    education: Array<string>;
    experience: Array<string>;
    isCompany: boolean;
    skills: Array<string>;
}
export interface Connection {
    user1: Principal;
    user2: Principal;
}
export interface backendInterface {
    addComment(postId: PostId, content: string): Promise<CommentId>;
    createJobListing(title: string, company: string, description: string, location: string, requirements: Array<string>): Promise<JobId>;
    createOrUpdateProfile(name: string, headline: string, experience: Array<string>, skills: Array<string>, education: Array<string>, isCompany: boolean): Promise<void>;
    createPost(content: string): Promise<PostId>;
    getAllJobListings(): Promise<Array<JobListing>>;
    getAllPosts(): Promise<Array<Post>>;
    getAllProfiles(): Promise<Array<Profile>>;
    getConnectionRequests(user: Principal): Promise<Array<Connection>>;
    getConnections(user: Principal): Promise<Array<Connection>>;
    getMessages(user: Principal): Promise<Array<Message>>;
    getProfile(principal: Principal): Promise<Profile>;
    likePost(postId: PostId): Promise<void>;
    respondToConnectionRequest(from: Principal, accept: boolean): Promise<void>;
    sendConnectionRequest(to: Principal): Promise<void>;
    sendMessage(receiver: Principal, content: string): Promise<MessageId>;
}
