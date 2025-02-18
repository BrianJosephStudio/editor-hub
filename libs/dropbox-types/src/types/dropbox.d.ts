export interface ListFolderResponse {
    entries: Metadata[];
    cursor: string;
    has_more: boolean;
  }
  
  export type Metadata = FileMetadata | FolderMetadata;
  
  interface FileMetadata {
    ".tag": "file" | 'success';
    name: string; // The last component of the path (including extension). This never contains a slash.
    id: string; // A unique identifier for the file.
    client_modified: string; // Timestamp in "%Y-%m-%dT%H:%M:%SZ" format. Modification time set by the desktop client.
    server_modified: string; // Timestamp in "%Y-%m-%dT%H:%M:%SZ" format. Last modification time on Dropbox.
    rev: string; // A unique identifier for the current revision of the file.
    size: number; // The file size in bytes.
    path_lower?: string; // Lowercased full path. Starts with a slash. Nullable if not mounted.
    path_display?: string; // Cased path for display purposes. Nullable if not mounted.
    parent_shared_folder_id?: string; // Deprecated. Use `FileSharingInfo.parent_shared_folder_id`.
    preview_url?: string; // Preview URL of the file.
    media_info?: MediaInfo; // Additional information if the file is a photo or video.
    symlink_info?: SymlinkInfo; // Metadata if the file is a symlink.
    sharing_info?: FileSharingInfo; // Metadata if the file is in a shared folder.
    is_downloadable: boolean; // True if file can be downloaded directly; else it must be exported.
    export_info?: ExportInfo; // Information about export formats if `is_downloadable` is false.
    property_groups?: PropertyGroup[]; // Custom properties with a property template specified.
    has_explicit_shared_members?: boolean; // True if file has explicit shared members.
    content_hash?: string; // A 64-character hash of the file content for integrity verification.
    file_lock_info?: FileLockMetadata; // Metadata for the file's current lock, if any.
  }

  interface UploadStartBatchResponse {
    session_ids: string[]
}

  interface UploadCheckResponse {
    '.tag': 'completed' | 'in_progress'
    entries?: UploadSessionFinishbatchResultEntry[]
  }

  interface UploadSessionFinishbatchResultEntry extends Omit<FileMetadata, "tag"> {
    tag: "success" | "failure";
}

interface UploadSessionFinishBatchResult {
  async_job_id: string
}
  
  interface FolderMetadata {
    ".tag": "folder";
    name: string; // The last component of the path (including extension). This never contains a slash.
    id: string; // A unique identifier for the folder.
    path_lower?: string; // Lowercased full path. Starts with a slash. Nullable if not mounted.
    path_display?: string; // Cased path for display purposes. Nullable if not mounted.
    parent_shared_folder_id?: string; // Deprecated. Use `FolderSharingInfo.parent_shared_folder_id`.
    preview_url?: string; // Preview URL of the folder.
    shared_folder_id?: string; // Deprecated. Use `sharing_info` instead.
    sharing_info?: FolderSharingInfo; // Metadata if the folder is contained in or is a shared folder mount point.
    property_groups?: PropertyGroup[]; // Custom properties with user-owned templates specified.
  }
  
  interface FolderSharingInfo {
    read_only: boolean; // True if the folder is inside a read-only shared folder.
    parent_shared_folder_id?: string; // ID of the parent shared folder if the folder is contained by one. Optional.
    shared_folder_id?: string; // ID of the shared folder mounted at this location, if applicable. Optional.
    traverse_only: boolean; // True if the folder can only be traversed due to limited access. Defaults to false.
    no_access: boolean; // True if the folder cannot be accessed by the user. Defaults to false.
  }
  
  interface MediaInfo {
    pending?: void; // Indicates the photo/video is still under processing.
    metadata?: MediaMetadata; // Metadata for the photo/video.
  }
  
  interface MediaMetadata {
    photo?: PhotoMetadata; // Metadata for a photo.
    video?: VideoMetadata; // Metadata for a video.
  }
  
  interface PhotoMetadata {
    dimensions?: Dimensions; // Dimensions of the photo. Optional.
    location?: GpsCoordinates; // GPS coordinates of the photo. Optional.
    time_taken?: string; // Timestamp when the photo was taken. Format: "%Y-%m-%dT%H:%M:%SZ". Optional.
  }
  
  interface VideoMetadata {
    dimensions?: Dimensions; // Dimensions of the video. Optional.
    location?: GpsCoordinates; // GPS coordinates of the video. Optional.
    time_taken?: string; // Timestamp when the video was taken. Format: "%Y-%m-%dT%H:%M:%SZ". Optional.
    duration?: number; // Duration of the video in milliseconds. Optional.
  }
  
  interface Dimensions {
    height: number; // Height of the photo/video.
    width: number; // Width of the photo/video.
  }
  
  interface GpsCoordinates {
    latitude: number; // Latitude of the GPS coordinates.
    longitude: number; // Longitude of the GPS coordinates.
  }
  
  interface SymlinkInfo {
    target: string; // Target this symlink points to.
  }
  
  interface FileSharingInfo {
    read_only: boolean; // True if the file is in a read-only shared folder.
    parent_shared_folder_id: string; // ID of the shared folder containing this file.
    modified_by?: string; // Last user who modified the file. Optional.
  }
  
  interface ExportInfo {
    export_as?: string; // Format to which the file can be exported. Optional.
    export_options?: string[]; // Additional formats to which the file can be exported. Optional.
  }
  
  interface PropertyGroup {
    template_id: string; // Unique identifier for the associated template.
    fields: PropertyField[]; // List of property fields in the template.
  }
  
  interface PropertyField {
    name: string; // Key of the property field.
    value: string; // Value of the property field.
  }
  
  interface FileLockMetadata {
    is_lockholder?: boolean; // True if the caller holds the file lock. Optional.
    lockholder_name?: string; // Display name of the lock holder. Optional.
    lockholder_account_id?: string; // Account ID of the lock holder. Optional.
    created?: string; // Timestamp when the lock was created. Format: "%Y-%m-%dT%H:%M:%SZ". Optional.
  }
  
  export interface SharedLinkResponse {
    ".tag": "file";
    client_modified: string; // ISO 8601 date string
    id: string;
    link_permissions: LinkPermissions;
    name: string;
    path_lower: string;
    rev: string;
    server_modified: string; // ISO 8601 date string
    size: number;
    team_member_info?: TeamMemberInfo;
    url: string;
  }
  
  interface LinkPermissions {
    allow_comments: boolean;
    allow_download: boolean;
    audience_options: AudienceOption[];
    can_allow_download: boolean;
    can_disallow_download: boolean;
    can_remove_expiry: boolean;
    can_remove_password: boolean;
    can_revoke: boolean;
    can_set_expiry: boolean;
    can_set_password: boolean;
    can_use_extended_sharing_controls: boolean;
    require_password: boolean;
    resolved_visibility: Visibility;
    revoke_failure_reason: RevokeFailureReason;
    team_restricts_comments: boolean;
    visibility_policies: VisibilityPolicy[];
  }
  
  interface AudienceOption {
    allowed: boolean;
    audience: Visibility;
  }
  
  interface Visibility {
    ".tag": string; // Possible values: "public", "team", "no_one", etc.
  }
  
  interface RevokeFailureReason {
    ".tag": string; // Possible values: "owner_only", etc.
  }
  
  interface VisibilityPolicy {
    allowed: boolean;
    policy: Visibility;
    resolved_policy: Visibility;
  }
  
  interface TeamMemberInfo {
    display_name: string;
    member_id: string;
    team_info: TeamInfo;
  }
  
  interface TeamInfo {
    id: string;
    name: string;
  }