## Workshop làm quen với cocos2d-x
### 1. Hiển thị hình ảnh

Viết thêm code trong hàm initBackGround src/SysMenu.js, line 73

Sử dụng các content:

 res/loading.png

 res/logo.png

 res/logoBack.png

 (Lưu ý cần scale Sprite lên 1,5 lần)

### 2. Điều khiển phi thuyền
#### Điều khiển Phi thuyền bằng touch:

Viết thêm code trong hàm addTouchListener của src/GameLayer.js

Sử dụng touch.getDelta(): độ dịch chuyển của touch

#### Điều khiển Phi thuyền bằng keyboard:

Viết code trong hàm addKeyboardListener của src/GameLayer.js

Xem di chuyển lên xuống bằng phím trong hàm updateMove của src/Ship.js

### 3. Thêm quân địch:

Code quỹ đạo đường đi cho quân địch: 

![](overlap.jpg)

Nếu phi thuyền xuất hiện bên phải(trái) thì di chuyển sang trái(phải) giữa màn hình, rồi sang phải(trái) cuối màn hình 

Viết thêm code trong hàm addEnemyToGameLayer, LevelManager.js

### 4. Hiệu ứng nổ của viên đạn

Hoàn thiện class HitEffect

Tham khảo: SparkEffect



