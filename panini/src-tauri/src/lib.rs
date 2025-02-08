use serde::{Serialize};
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize)]
struct FileNode {
    name: String,
    children: Vec<FileNode>,
    is_dir: bool,
}

impl FileNode {
    fn new(name: String, is_dir: bool) -> Self {
        FileNode {
            name,
            children: Vec::new(),
            is_dir,
        }
    }
}

fn build_tree<P: AsRef<Path>>(path: P) -> Result<FileNode, String> {
    let path = path.as_ref();
    let metadata = fs::metadata(path).map_err(|e| e.to_string())?;
    let name = path.file_name()
        .unwrap_or_else(|| path.as_os_str())
        .to_string_lossy()
        .into_owned();

    let mut tree = FileNode::new(name, metadata.is_dir());

    if metadata.is_dir() {
        let mut entries: Vec<_> = fs::read_dir(path)
            .map_err(|e| e.to_string())?
            .filter_map(Result::ok)
            .collect();

        entries.sort_by(|a, b| {
            let a_metadata = a.metadata().unwrap();
            let b_metadata = b.metadata().unwrap();
            let a_is_dir = a_metadata.is_dir();
            let b_is_dir = b_metadata.is_dir();

            match (a_is_dir, b_is_dir) {
                (true, false) => std::cmp::Ordering::Less,
                (false, true) => std::cmp::Ordering::Greater,
                _ => a.file_name().cmp(&b.file_name()),
            }
        });

        for entry in entries {
            match build_tree(entry.path()) {
                Ok(child_tree) => tree.children.push(child_tree),
                Err(e) => eprintln!("Error processing {}: {}", entry.path().display(), e),
            }
        }
    }

    Ok(tree)
}

#[tauri::command]
fn get_file_tree(path: String) -> Result<FileNode, String> {
    build_tree(path)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_file_tree])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
