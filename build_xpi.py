import os
import zipfile

def create_xpi():
    project_dir = os.path.dirname(os.path.abspath(__file__))
    xpi_path = os.path.join(project_dir, 'DarkModeSwitch_v7.xpi')
    
    files_to_include = [
        'manifest.json',
        'background/background.js',
        'content_scripts/dark-mode.css',
        'content_scripts/dark-mode.js',
        'content_scripts/lightbox.css',
        'content_scripts/lightbox.js',
        'popup/popup.html',
        'popup/popup.css',
        'popup/popup.js',
        'options/options.html',
        'options/options.css',
        'options/options.js',
        'icons/icon-off-16.png',
        'icons/icon-off-32.png',
        'icons/icon-off-48.png',
        'icons/icon-off-128.png',
        'icons/icon-on-16.png',
        'icons/icon-on-32.png',
        'icons/icon-on-48.png',
        'icons/icon-on-128.png'
    ]
    
    with zipfile.ZipFile(xpi_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for file_path in files_to_include:
            full_path = os.path.join(project_dir, file_path)
            if os.path.exists(full_path):
                zf.write(full_path, file_path)
                print(f'Added: {file_path}')
            else:
                print(f'Skipped (not found): {file_path}')
    
    print(f'\nXPI created: {xpi_path}')
    print(f'Size: {os.path.getsize(xpi_path)} bytes')

if __name__ == '__main__':
    create_xpi()
