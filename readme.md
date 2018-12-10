Payment Gateway Assignment with Mysql Transaction

In this Assignment---> Project Name --> "SHOPNIX"

        1-> Admin Panel 
                |
                |==> technology -- Angular 6
                |
                |==> Features -- 1. Admin can add shops
                                 2. Admin can add shop banks
                                 3. Admin can add other admins
                                 4. Admin can see all the bookings
                                 5. Admin can see all the shops
                                 6. Get profile and see there wallet and pending amounts
                                 7. with session storage feature
                                 8. change password

        2-> Customer Panel
                |
                |==> technology -- Angular 6
                |
                |==> Feature -- 1. Customer can register and login there accounts
                                2. See products on dashboard 
                                3. Book there products
                                4. See there all bookings
                                5. If payment is pending make payment
                                6. See there card details
                                7. They cab add and delete there card
                                8. See there payment history
                                9. They can add money to there wallet
                                10. Then can see there profile in which they can see existing wallet
                                11. Change password

        3-> Backend 
                |
                |==> technology -- Node(Express), MySql Database
                |
                |==> Feature -- 1. All the api's related with Admin and Customer Panel
                                2. Payment Method --> STRIPE PAYMENT GATEWAY
                                3. With MySql transaction 
                                4. Booking Created with #3 Real Time Scenario (3 API's)
                                                |
                                                |=> 1. When Booking is created at a time complete amount 
                                                       send to shop via customer in this no promo will be used.
                                                    2. When Booking is created with promo in customer send money
                                                       to admin (after less with promo) and then admin add the rest of promo money and then transfer to shop in shop bank.
                                                    3. When Booking is created with promo in this customer           transfer money to shop after using promo and the rest of      promo money will be send by admin which will be done in 24    hours or we can change to weekly payment like Uber.