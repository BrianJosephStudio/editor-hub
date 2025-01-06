export interface DropboxFile {
    client_modified: string,
    content_hash: string,
    file_lock_info: {
        created: string,
        is_lockholder: boolean,
        lockholder_name: string
    },
    has_explicit_shared_members: boolean,
    id: string,
    is_downloadable: boolean,
    name: string,
    path_display: string,
    path_lower: string,
    property_groups: [
        {
            fields: [
                {
                    name: string,
                    value: string
                }
            ],
            template_id: string
        }
    ],
    rev: string,
    server_modified: string,
    sharing_info: {
        modified_by: string,
        parent_shared_folder_id: string,
        read_only: boolean
    },
    size: number
}

export interface ListFolderResponse {
    cursor: string,
    entries: DropboxFile[],
    has_more: boolean
}

export interface Tag {
    ".tag": string,
    tag_text: string 
}

export interface FileTag {
    path: string,
    tags: Tag[]
}

export interface GetTagsResponse {
    paths_to_tags: FileTag[]
}

export interface GetTemporaryLinkResponse {
    link:"https://ucabc123456.dl.dropboxusercontent.com/cd/0/get/abcdefghijklmonpqrstuvwxyz1234567890/file",
    metadata: DropboxFile
}