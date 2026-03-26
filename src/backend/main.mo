import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

actor {
  // ============= Types and Comparison Functions =============
  type PostId = Nat;
  type MessageId = Nat;
  type JobId = Nat;
  type CommentId = Nat;

  type Profile = {
    principal : Principal;
    name : Text;
    headline : Text;
    experience : [Text];
    skills : [Text];
    education : [Text];
    isCompany : Bool;
  };

  module Profile {
    public func compare(profile1 : Profile, profile2 : Profile) : Order.Order {
      Principal.compare(profile1.principal, profile2.principal);
    };
  };

  type Connection = {
    user1 : Principal;
    user2 : Principal;
  };

  module Connection {
    public func compare(connection1 : Connection, connection2 : Connection) : Order.Order {
      switch (Principal.compare(connection1.user1, connection2.user1)) {
        case (#equal) { Principal.compare(connection1.user2, connection2.user2) };
        case (order) { order };
      };
    };
  };

  type Status = {
    #pending;
    #accepted;
    #rejected;
  };

  type Post = {
    id : PostId;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
    likes : [Principal];
    comments : [Comment];
  };

  module Post {
    public func compare(post1 : Post, post2 : Post) : Order.Order {
      compareByTimestamp(post1, post2);
    };

    public func compareByTimestamp(post1 : Post, post2 : Post) : Order.Order {
      if (post1.timestamp > post2.timestamp) { return #greater };
      if (post1.timestamp < post2.timestamp) { return #less };
      #equal;
    };
  };

  type Comment = {
    timestamp : Time.Time;
    id : CommentId;
    author : Principal;
    content : Text;
  };

  module Comment {
    public func compareByTimestamp(comment1 : Comment, comment2 : Comment) : Order.Order {
      if (comment1.timestamp > comment2.timestamp) { return #greater };
      if (comment1.timestamp < comment2.timestamp) { return #less };
      #equal;
    };
  };

  type Message = {
    id : MessageId;
    sender : Principal;
    receiver : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  type JobListing = {
    id : JobId;
    title : Text;
    company : Text;
    description : Text;
    location : Text;
    requirements : [Text];
    poster : Principal;
  };

  var postIdCounter = 0;
  var messageIdCounter = 0;
  var jobIdCounter = 0;
  var commentIdCounter = 0;

  // ============= Data Structures =============
  let profiles = Map.empty<Principal, Profile>();
  let posts = Map.empty<PostId, Post>();
  let messages = Map.empty<Principal, List.List<Message>>();
  let jobListings = Map.empty<JobId, JobListing>();
  let connections = Map.empty<Connection, Status>();

  // ============= Profile Management =============
  public shared ({ caller }) func createOrUpdateProfile(name : Text, headline : Text, experience : [Text], skills : [Text], education : [Text], isCompany : Bool) : async () {
    let profile : Profile = {
      principal = caller;
      name;
      headline;
      experience;
      skills;
      education;
      isCompany;
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getProfile(principal : Principal) : async Profile {
    switch (profiles.get(principal)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getAllProfiles() : async [Profile] {
    profiles.values().toArray().sort();
  };

  // ============= Connection Management =============
  public shared ({ caller }) func sendConnectionRequest(to : Principal) : async () {
    if (not profiles.containsKey(to)) {
      Runtime.trap("User does not exist");
    };

    let connection = {
      user1 = caller;
      user2 = to;
    };
    connections.add(connection, #pending);
  };

  public shared ({ caller }) func respondToConnectionRequest(from : Principal, accept : Bool) : async () {
    let connection = {
      user1 = from;
      user2 = caller;
    };

    switch (connections.get(connection)) {
      case (?status) {
        switch (status) {
          case (#pending) {
            connections.add(connection, if accept { #accepted } else { #rejected });
          };
          case (_) { Runtime.trap("Request cannot be responded to") };
        };
      };
      case (null) { Runtime.trap("No pending connection request found") };
    };
  };

  public query ({ caller }) func getConnections(user : Principal) : async [Connection] {
    let acceptedConnections = connections.toArray().filter(
      func(entry) {
        let ((conn, status)) = entry;
        (conn.user1 == user or conn.user2 == user) and status == #accepted
      }
    );

    let connectionList = List.empty<Connection>();
    acceptedConnections.forEach(
      func((conn, _)) {
        connectionList.add(conn);
      }
    );

    connectionList.toArray();
  };

  public query ({ caller }) func getConnectionRequests(user : Principal) : async [Connection] {
    let pendingRequests = connections.toArray().filter(
      func(entry) {
        let ((conn, status)) = entry;
        conn.user2 == user and status == #pending
      }
    );

    let connectionList = List.empty<Connection>();
    pendingRequests.forEach(
      func((conn, _)) {
        connectionList.add(conn);
      }
    );

    connectionList.toArray();
  };

  // ============= Post Management =============
  public shared ({ caller }) func createPost(content : Text) : async PostId {
    postIdCounter += 1;
    let post : Post = {
      id = postIdCounter;
      author = caller;
      content;
      timestamp = Time.now();
      likes = [];
      comments = [];
    };
    posts.add(postIdCounter, post);
    postIdCounter;
  };

  public shared ({ caller }) func likePost(postId : PostId) : async () {
    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) {
        let likesList = List.fromArray(post.likes);
        likesList.add(caller);
        let updatedPost = { post with likes = likesList.toArray() };
        posts.add(postId, updatedPost);
      };
    };
  };

  public shared ({ caller }) func addComment(postId : PostId, content : Text) : async CommentId {
    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) {
        commentIdCounter += 1;
        let comment : Comment = {
          timestamp = Time.now();
          id = commentIdCounter;
          author = caller;
          content;
        };

        let commentsList = List.fromArray<Comment>(post.comments);
        commentsList.add(comment);
        let updatedPost = {
          post with comments = commentsList.toArray();
        };
        posts.add(postId, updatedPost);
        commentIdCounter;
      };
    };
  };

  public query ({ caller }) func getAllPosts() : async [Post] {
    let postsArray = posts.values().toArray();
    postsArray.sort();
  };

  // ============= Messaging =============
  public shared ({ caller }) func sendMessage(receiver : Principal, content : Text) : async MessageId {
    messageIdCounter += 1;
    let message : Message = {
      id = messageIdCounter;
      sender = caller;
      receiver;
      content;
      timestamp = Time.now();
    };

    let senderList = switch (messages.get(caller)) {
      case (null) { List.empty<Message>() };
      case (?list) { list };
    };

    senderList.add(message : Message);

    messages.add(caller, senderList);

    messageIdCounter;
  };

  public query ({ caller }) func getMessages(user : Principal) : async [Message] {
    switch (messages.get(user)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  // ============= Job Listings =============
  public shared ({ caller }) func createJobListing(title : Text, company : Text, description : Text, location : Text, requirements : [Text]) : async JobId {
    jobIdCounter += 1;
    let job : JobListing = {
      id = jobIdCounter;
      title;
      company;
      description;
      location;
      requirements;
      poster = caller;
    };
    jobListings.add(jobIdCounter, job);
    jobIdCounter;
  };

  public query ({ caller }) func getAllJobListings() : async [JobListing] {
    jobListings.values().toArray();
  };
};
