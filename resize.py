import PIL.Image  
img = PIL.Image.open('public/assets/images/logo.jpg')  
img.resize((192,192)).save('public/assets/images/logo-192.png', 'PNG')  
img.resize((512,512)).save('public/assets/images/logo-512.png', 'PNG')  
