//package com.pahanaedu;
//
//
//@SpringBootTest
//public class DatabaseConnectionTest {
//
//    @Autowired
//    private DataSource dataSource;
//
//    @Test
//    public void testDatabaseConnection() throws Exception {
//        try (Connection connection = dataSource.getConnection()) {
//            assertTrue(connection.isValid(1));
//            System.out.println("Database connection successful!");
//        }
//    }
//}