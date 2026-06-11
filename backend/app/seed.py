from sqlalchemy.orm import Session
from datetime import date
from .database import SessionLocal, engine
from . import models

def seed():
    db = SessionLocal()
    # Ensure tables are created
    models.Base.metadata.create_all(bind=engine)
    
    # Check if data already exists
    if db.query(models.Media).count() > 0:
        print("Database already seeded.")
        return

    sample_media = [
        # 12 months
        {
            "filename": "birthday_cake.jpg",
            "nas_path": "/volume1/photos/2024/04/birthday_cake.jpg",
            "file_type": "photo",
            "taken_at": date(2024, 4, 15),
            "age_months": 12,
            "event_name": "初めてのお誕生日",
            "tags": "笑顔,食事,家族",
            "memo": "1歳のお誕生日！ケーキを美味しそうに食べていました。",
            "is_favorite": True
        },
        {
            "filename": "first_steps.mp4",
            "nas_path": "/volume1/photos/2024/04/first_steps.mp4",
            "file_type": "video",
            "taken_at": date(2024, 4, 20),
            "age_months": 12,
            "event_name": "お家での日常",
            "tags": "歩いた,室内,感動",
            "memo": "ついに数歩歩けるようになりました！",
            "is_favorite": True
        },
        # 13 months
        {
            "filename": "park_walk.jpg",
            "nas_path": "/volume1/photos/2024/05/park_walk.jpg",
            "file_type": "photo",
            "taken_at": date(2024, 5, 10),
            "age_months": 13,
            "event_name": "お散歩",
            "tags": "屋外,遊び",
            "memo": "近くの公園でお散歩。靴を履いて歩くのが楽しいみたい。",
            "is_favorite": False
        },
        {
            "filename": "entrance_ceremony.jpg",
            "nas_path": "/volume1/photos/2024/05/entrance_ceremony.jpg",
            "file_type": "photo",
            "taken_at": date(2024, 5, 1),
            "age_months": 13,
            "event_name": "入園式",
            "tags": "保育園,家族,正装",
            "memo": "保育園の入園式。少し緊張気味。",
            "is_favorite": True
        },
        # 14 months
        {
            "filename": "pool_day.jpg",
            "nas_path": "/volume1/photos/2024,06/pool_day.jpg",
            "file_type": "photo",
            "taken_at": date(2024, 6, 25),
            "age_months": 14,
            "event_name": "保育園のプール",
            "tags": "保育園,遊び,屋外",
            "memo": "初めてのプール。水遊びが大好き！",
            "is_favorite": False
        },
        {
            "filename": "crying_face.jpg",
            "nas_path": "/volume1/photos/2024/06/crying_face.jpg",
            "file_type": "photo",
            "taken_at": date(2024, 6, 5),
            "age_months": 14,
            "event_name": "お家での日常",
            "tags": "泣き顔,室内",
            "memo": "おもちゃが取れなくて大泣き。",
            "is_favorite": False
        },
        # 15 months
        {
            "filename": "summer_vacation.jpg",
            "nas_path": "/volume1/photos/2024/07/summer_vacation.jpg",
            "file_type": "photo",
            "taken_at": date(2024, 7, 20),
            "age_months": 15,
            "event_name": "家族旅行",
            "tags": "家族,屋外,笑顔",
            "memo": "海への家族旅行。砂浜で大喜び。",
            "is_favorite": True
        },
        {
            "filename": "running_in_park.mp4",
            "nas_path": "/volume1/photos/2024/07/running_in_park.mp4",
            "file_type": "video",
            "taken_at": date(2024, 7, 10),
            "age_months": 15,
            "event_name": "お散歩",
            "tags": "走った,屋外,遊び",
            "memo": "公園を走り回る姿が頼もしい。",
            "is_favorite": False
        },
        # 16 months
        {
            "filename": "drawing.jpg",
            "nas_path": "/volume1/photos/2024/08/drawing.jpg",
            "file_type": "photo",
            "taken_at": date(2024, 8, 15),
            "age_months": 16,
            "event_name": "お家での日常",
            "tags": "室内,遊び",
            "memo": "初めてのクレヨンでお絵描き。",
            "is_favorite": False
        },
        {
            "filename": "eating_alone.mp4",
            "nas_path": "/volume1/photos/2024/08/eating_alone.mp4",
            "file_type": "video",
            "taken_at": date(2024, 8, 25),
            "age_months": 16,
            "event_name": "お家での日常",
            "tags": "食事,室内",
            "memo": "スプーンを使って上手に食べられるようになった。",
            "is_favorite": False
        },
        # 18 months
        {
            "filename": "sports_day.jpg",
            "nas_path": "/volume1/photos/2024/10/sports_day.jpg",
            "file_type": "photo",
            "taken_at": date(2024, 10, 10),
            "age_months": 18,
            "event_name": "運動会",
            "tags": "保育園,屋外,走った",
            "memo": "初めての運動会！一生懸命走りました。",
            "is_favorite": True
        },
        {
            "filename": "christmas_party.jpg",
            "nas_path": "/volume1/photos/2024/12/christmas_party.jpg",
            "file_type": "photo",
            "taken_at": date(2024, 12, 24),
            "age_months": 20,
            "event_name": "クリスマス会",
            "tags": "家族,室内,笑顔",
            "memo": "サンタさんからプレゼントをもらってニッコリ。",
            "is_favorite": True
        },
        {
            "filename": "play_show.mp4",
            "nas_path": "/volume1/photos/2025/02/play_show.mp4",
            "file_type": "video",
            "taken_at": date(2025, 2, 15),
            "age_months": 22,
            "event_name": "お遊戯会",
            "tags": "保育園,室内,遊び",
            "memo": "お遊戯会でダンスを披露。上手に踊れました。",
            "is_favorite": True
        },
        {
            "filename": "zoo_trip.jpg",
            "nas_path": "/volume1/photos/2025/03/zoo_trip.jpg",
            "file_type": "photo",
            "taken_at": date(2025, 3, 20),
            "age_months": 23,
            "event_name": "家族旅行",
            "tags": "家族,屋外,笑顔",
            "memo": "動物園へ。キリンに釘付け。",
            "is_favorite": False
        },
        {
            "filename": "sand_play.jpg",
            "nas_path": "/volume1/photos/2024/09/sand_play.jpg",
            "file_type": "photo",
            "taken_at": date(2024, 9, 10),
            "age_months": 17,
            "event_name": "お散歩",
            "tags": "屋外,遊び",
            "memo": "砂場遊びに夢中。",
            "is_favorite": False
        },
        {
            "filename": "halloween_costume.jpg",
            "nas_path": "/volume1/photos/2024/10/halloween_costume.jpg",
            "file_type": "photo",
            "taken_at": date(2024, 10, 31),
            "age_months": 18,
            "event_name": "お家での日常",
            "tags": "室内,遊び,笑顔",
            "memo": "ハロウィンの仮装。カボチャさんになりました。",
            "is_favorite": False
        },
        {
            "filename": "sliding.mp4",
            "nas_path": "/volume1/photos/2024/11/sliding.mp4",
            "file_type": "video",
            "taken_at": date(2024, 11, 15),
            "age_months": 19,
            "event_name": "お散歩",
            "tags": "屋外,遊び",
            "memo": "滑り台を一人で滑れるようになった！",
            "is_favorite": False
        },
        {
            "filename": "sleeping_face.jpg",
            "nas_path": "/volume1/photos/2024/04/sleeping_face.jpg",
            "file_type": "photo",
            "taken_at": date(2024, 4, 30),
            "age_months": 12,
            "event_name": "お家での日常",
            "tags": "室内,寝顔",
            "memo": "すやすや寝顔。天使みたい。",
            "is_favorite": False
        },
        {
            "filename": "blocks_play.jpg",
            "nas_path": "/volume1/photos/2024/05/blocks_play.jpg",
            "file_type": "photo",
            "taken_at": date(2024, 5, 20),
            "age_months": 13,
            "event_name": "お家での日常",
            "tags": "室内,遊び",
            "memo": "ブロックを高く積めるようになった。",
            "is_favorite": False
        },
        {
            "filename": "strawberry_eating.mp4",
            "nas_path": "/volume1/photos/2024/05/strawberry_eating.mp4",
            "file_type": "video",
            "taken_at": date(2024, 5, 25),
            "age_months": 13,
            "event_name": "お家での日常",
            "tags": "食事,笑顔",
            "memo": "イチゴを食べて幸せそうな顔。",
            "is_favorite": False
        }
    ]

    for item in sample_media:
        db_media = models.Media(**item)
        db.add(db_media)
    
    db.commit()
    print(f"Successfully seeded {len(sample_media)} media entries.")
    db.close()

if __name__ == "__main__":
    seed()
