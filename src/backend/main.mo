import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Study Tracker Types
  type Subject = {
    id : Nat;
    name : Text;
    colorHex : Text;
    createdAt : Int;
  };

  type Assignment = {
    id : Nat;
    subjectId : Nat;
    title : Text;
    description : Text;
    dueDate : Int;
    completed : Bool;
    createdAt : Int;
  };

  type StudySession = {
    id : Nat;
    subjectId : Nat;
    durationSeconds : Nat;
    date : Int;
    createdAt : Int;
  };

  type DailyStats = {
    dayIndex : Nat;
    totalSeconds : Nat;
  };

  type SubjectStats = {
    subjectId : Nat;
    totalSeconds : Nat;
  };

  var subjectIdCounter = 0;
  var assignmentIdCounter = 0;
  var sessionIdCounter = 0;

  // Persistent stores (authors -> Map of entities)
  let subjects = Map.empty<Principal, Map.Map<Nat, Subject>>();
  let assignments = Map.empty<Principal, Map.Map<Nat, Assignment>>();
  let studySessions = Map.empty<Principal, Map.Map<Nat, StudySession>>();

  func getOrCreateMap<K, V>(
    store : Map.Map<Principal, Map.Map<K, V>>,
    author : Principal,
    emptyMap : Map.Map<K, V>,
  ) : Map.Map<K, V> {
    switch (store.get(author)) {
      case (null) { emptyMap };
      case (?existing) { existing };
    };
  };

  public shared ({ caller }) func addSubject(name : Text, colorHex : Text) : async Subject {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add subjects");
    };

    subjectIdCounter += 1;
    let newSubject : Subject = {
      id = subjectIdCounter;
      name;
      colorHex;
      createdAt = Time.now();
    };

    let authorSubjects = getOrCreateMap(subjects, caller, Map.empty<Nat, Subject>());
    authorSubjects.add(newSubject.id, newSubject);
    subjects.add(caller, authorSubjects);

    newSubject;
  };

  public query ({ caller }) func getSubjects() : async [Subject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view subjects");
    };

    switch (subjects.get(caller)) {
      case (null) { [] };
      case (?s) {
        s.values().toArray();
      };
    };
  };

  public shared ({ caller }) func updateSubject(id : Nat, name : Text, colorHex : Text) : async ?Subject {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update subjects");
    };

    switch (subjects.get(caller)) {
      case (null) { null };
      case (?authorSubjects) {
        switch (authorSubjects.get(id)) {
          case (null) { null };
          case (?existing) {
            let updated : Subject = {
              existing with
              name;
              colorHex;
            };
            authorSubjects.add(id, updated);
            ?updated;
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteSubject(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete subjects");
    };

    switch (subjects.get(caller)) {
      case (null) { false };
      case (?authorSubjects) {
        let existed = authorSubjects.containsKey(id);
        authorSubjects.remove(id);
        existed;
      };
    };
  };

  public shared ({ caller }) func addAssignment(subjectId : Nat, title : Text, description : Text, dueDate : Int) : async Assignment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add assignments");
    };

    assignmentIdCounter += 1;
    let newAssignment : Assignment = {
      id = assignmentIdCounter;
      subjectId;
      title;
      description;
      dueDate;
      completed = false;
      createdAt = Time.now();
    };

    let authorAssignments = getOrCreateMap(assignments, caller, Map.empty<Nat, Assignment>());
    authorAssignments.add(newAssignment.id, newAssignment);
    assignments.add(caller, authorAssignments);

    newAssignment;
  };

  public query ({ caller }) func getAssignments() : async [Assignment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view assignments");
    };

    switch (assignments.get(caller)) {
      case (null) { [] };
      case (?a) {
        a.values().toArray();
      };
    };
  };

  public shared ({ caller }) func updateAssignment(id : Nat, title : Text, description : Text, dueDate : Int) : async ?Assignment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update assignments");
    };

    switch (assignments.get(caller)) {
      case (null) { null };
      case (?authorAssignments) {
        switch (authorAssignments.get(id)) {
          case (null) { null };
          case (?existing) {
            let updated : Assignment = {
              existing with
              title;
              description;
              dueDate;
            };
            authorAssignments.add(id, updated);
            ?updated;
          };
        };
      };
    };
  };

  public shared ({ caller }) func toggleAssignment(id : Nat) : async ?Assignment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle assignments");
    };

    switch (assignments.get(caller)) {
      case (null) { null };
      case (?authorAssignments) {
        switch (authorAssignments.get(id)) {
          case (null) { null };
          case (?existing) {
            let updated : Assignment = {
              existing with
              completed = not existing.completed;
            };
            authorAssignments.add(id, updated);
            ?updated;
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteAssignment(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete assignments");
    };

    switch (assignments.get(caller)) {
      case (null) { false };
      case (?authorAssignments) {
        let existed = authorAssignments.containsKey(id);
        authorAssignments.remove(id);
        existed;
      };
    };
  };

  public shared ({ caller }) func logStudySession(subjectId : Nat, durationSeconds : Nat, date : Int) : async StudySession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log study sessions");
    };

    sessionIdCounter += 1;
    let newSession : StudySession = {
      id = sessionIdCounter;
      subjectId;
      durationSeconds;
      date;
      createdAt = Time.now();
    };

    let authorSessions = getOrCreateMap(studySessions, caller, Map.empty<Nat, StudySession>());
    authorSessions.add(newSession.id, newSession);
    studySessions.add(caller, authorSessions);

    newSession;
  };

  public query ({ caller }) func getStudySessions() : async [StudySession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view study sessions");
    };

    switch (studySessions.get(caller)) {
      case (null) { [] };
      case (?s) {
        s.values().toArray();
      };
    };
  };

  public query ({ caller }) func getSessionsByDateRange(startDate : Int, endDate : Int) : async [StudySession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view study sessions");
    };

    switch (studySessions.get(caller)) {
      case (null) { [] };
      case (?sessions) {
        let filteredIter = sessions.values().filter(
          func(session) {
            session.date >= startDate and session.date <= endDate
          }
        );
        filteredIter.toArray();
      };
    };
  };

  public query ({ caller }) func getWeeklyStats(weekStartDate : Int) : async [DailyStats] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view weekly stats");
    };

    let dayInNanos = 24 * 60 * 60 * 1000000000;
    let emptyStats = Array.tabulate(7, func(i) { { dayIndex = i; totalSeconds = 0 } });

    switch (studySessions.get(caller)) {
      case (null) { emptyStats };
      case (?sessions) {
        let weeklyStats = sessions.values().foldLeft(
          emptyStats,
          func(currentStats, session) {
            if (session.date >= weekStartDate and session.date < weekStartDate + 7 * dayInNanos) {
              let dayIndex = Int.abs((session.date - weekStartDate) / dayInNanos);
              if (dayIndex < 7) {
                let updatedStats = Array.tabulate(
                  7,
                  func(i) {
                    if (i == dayIndex) { { dayIndex = i; totalSeconds = currentStats[i].totalSeconds + session.durationSeconds } } else {
                      currentStats[i];
                    };
                  },
                );
                updatedStats;
              } else {
                currentStats;
              };
            } else {
              currentStats;
            };
          },
        );
        weeklyStats;
      };
    };
  };

  public query ({ caller }) func getSubjectStats() : async [SubjectStats] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view subject stats");
    };

    switch (studySessions.get(caller)) {
      case (null) { [] };
      case (?sessions) {
        var statsMap = Map.empty<Nat, Nat>();

        sessions.values().forEach(
          func(session) {
            let total = switch (statsMap.get(session.subjectId)) {
              case (null) { 0 };
              case (?existing) { existing };
            };
            statsMap.add(session.subjectId, total + session.durationSeconds);
          }
        );

        let resultIter = statsMap.entries().map(
          func((subjectId, total)) {
            { subjectId; totalSeconds = total };
          }
        );
        resultIter.toArray();
      };
    };
  };
};

