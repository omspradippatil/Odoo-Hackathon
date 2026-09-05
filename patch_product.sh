sed -i '' '/private Boolean isRecurring;/a\
    @ManyToOne private User seller;\
    private String imageUrl;\
' backend/src/main/java/com/devflow/entity/Product.java
