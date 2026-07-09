#!/data/data/com.termux/files/usr/bin/bash

# E-Library Smart Import (Explorer Edition v2)
# This script allows you to navigate your internal storage and pick files.

PROJECT_DIR="/data/data/com.termux/files/home/wylibrary"
TEMP_DIR="/data/data/com.termux/files/home/wylibrary/scripts/temp"
mkdir -p "$TEMP_DIR"

current_dir="/storage/emulated/0"

# Function to pick via System File Manager
pick_via_system() {
    local picked_temp="$TEMP_DIR/picked_file"
    rm -f "$picked_temp"
    
    termux-toast "Opening system file picker..."
    termux-storage-get "$picked_temp"
    
    if [ ! -f "$picked_temp" ]; then
        return 1
    fi
    
    # Ask for filename
    local name=$(termux-dialog text -t "Save as..." -i "Enter filename (without extension)" | jq -r '.text')
    if [ "$name" == "null" ] || [ -z "$name" ]; then name="imported_file_$(date +%s)"; fi
    
    local type=$(termux-dialog radio -t "Select File Type" -v "PDF,DOCX" | jq -r '.text')
    local ext=".pdf"
    if [ "$type" == "DOCX" ]; then ext=".docx"; fi
    
    local final_path="$TEMP_DIR/${name}${ext}"
    mv "$picked_temp" "$final_path"
    echo "$final_path"
    return 0
}

while true; do
    # Get directories and compatible files
    items=$(ls -p "$current_dir" 2>/dev/null | grep -E '/$|\.(docx|pdf)$' | head -n 50)
    
    # Options
    options="[OPEN SYSTEM FILE MANAGER],.. (Go Up)"
    if [ -n "$items" ]; then
        comma_items=$(echo "$items" | tr '\n' ',' | sed 's/,$//')
        options="$options,$comma_items"
    fi

    # Use 'sheet' widget
    choice=$(termux-dialog sheet -t "Folder: ${current_dir#*/storage/emulated/0}" -v "$options" | jq -r '.text')

    if [ "$choice" == "null" ] || [ -z "$choice" ]; then
        exit 0
    fi

    if [ "$choice" == "[OPEN SYSTEM FILE MANAGER]" ]; then
        selected_file=$(pick_via_system)
        if [ $? -eq 0 ] && [ -n "$selected_file" ]; then
            break
        fi
    elif [ "$choice" == ".. (Go Up)" ]; then
        if [ "$current_dir" != "/storage/emulated/0" ]; then
            current_dir=$(dirname "$current_dir")
        else
            termux-toast "Already at root."
        fi
    elif [[ "$choice" == */ ]]; then
        current_dir="${current_dir}/${choice%/}"
    else
        selected_file="${current_dir}/${choice}"
        break
    fi
done

# Run the smart import process
termux-toast "Processing $(basename "$selected_file")..."

cd "$PROJECT_DIR"
node scripts/smart-import.js "$selected_file"

if [ $? -eq 0 ]; then
    termux-toast -c green "Import Successful!"
else
    termux-toast -c red "Import Failed."
fi

# Cleanup if it was a temp file
if [[ "$selected_file" == "$TEMP_DIR"* ]]; then
    rm -f "$selected_file"
fi
