export const processImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            
            img.onload = () => {

                const MAX_WIDTH = 1080;
                const MAX_HEIGHT = 1920;

                if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {

                    let ratio = Math.min(MAX_WIDTH / img.width, MAX_HEIGHT / img.height)

                    let newWidth = img.width * ratio;
                    let newHeight = img.height * ratio;

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    ctx?.drawImage(img, 0, 0, newWidth, newHeight);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(dataUrl);
                } else {
                    resolve(event.target?.result as string);
                }
            }

            img.onerror = (err) => {
                reject(err);
            }

            img.src = event.target?.result as string;
        }
        reader.onerror = (err) => reject(err);


        reader.readAsDataURL(file);

    });
}