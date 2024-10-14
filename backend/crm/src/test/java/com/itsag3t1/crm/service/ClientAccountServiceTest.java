class ClientAccountServiceTest {

    @Mock
    private ClientAccountRepository accountRepository;

    @InjectMocks
    private ClientAccountService accountService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private ClientAccount createAccount(Long clientId, ClientAccount.AccountType accountType, ClientAccount.AccountStatus accountStatus, String currency, String branchId, Double initialDeposit) {
        ClientAccount account = new ClientAccount();
        account.setClientId(clientId);
        account.setAccountType(accountType);
        account.setAccountStatus(accountStatus);
        account.setCurrency(currency);
        account.setBranchId(branchId);
        account.setInitialDeposit(initialDeposit);
        return account;
    }

    @Test
    void testCreateAccount_WithValidData() {
        ClientAccount account = createAccount(1L, ClientAccount.AccountType.SAVINGS, ClientAccount.AccountStatus.ACTIVE, "SGD", "B001", 0.0);
        when(accountRepository.save(any(ClientAccount.class))).thenReturn(account);

        ClientAccount createdAccount = accountService.createAccount(account);

        assertNotNull(createdAccount);
        assertEquals(account.getClientId(), createdAccount.getClientId());
        verify(accountRepository, times(1)).save(account);
    }

    @Test
    void testCreateAccount_WithNullInitialDeposit() {
        ClientAccount account = createAccount(1L, ClientAccount.AccountType.SAVINGS, ClientAccount.AccountStatus.ACTIVE, "SGD", "B001", null);

        ClientAccount createdAccount = accountService.createAccount(account);

        assertNotNull(createdAccount);
        assertEquals(0.0, createdAccount.getInitialDeposit());
    }

    @Test
    void testCreateAccount_WithNullClientId() {
        ClientAccount account = createAccount(null, ClientAccount.AccountType.SAVINGS, ClientAccount.AccountStatus.ACTIVE, "SGD", "B001", null);

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            accountService.createAccount(account);
        });

        assertEquals("Client ID must not be null", exception.getMessage());
    }

    @Test
    void testCreateAccount_WithNullAccountType() {
        ClientAccount account = createAccount(1L, null, ClientAccount.AccountStatus.ACTIVE, "SGD", "B001", null);

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            accountService.createAccount(account);
        });

        assertEquals("Account type must not be null", exception.getMessage());
    }

    // Skipping the invalid enum value test because it's handled at the deserialization level, not service level.

    @Test
    void testCreateAccount_WithNullAccountStatus() {
        ClientAccount account = createAccount(1L, ClientAccount.AccountType.SAVINGS, null, "SGD", "B001", null);

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            accountService.createAccount(account);
        });

        assertEquals("Account status must not be null", exception.getMessage());
    }

    @Test
    void testCreateAccount_WithNullCurrency() {
        ClientAccount account = createAccount(1L, ClientAccount.AccountType.SAVINGS, ClientAccount.AccountStatus.ACTIVE, null, "B001", null);

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            accountService.createAccount(account);
        });

        assertEquals("Currency must not be null", exception.getMessage());
    }

    @Test
    void testCreateAccount_WithNullBranchId() {
        ClientAccount account = createAccount(1L, ClientAccount.AccountType.SAVINGS, ClientAccount.AccountStatus.ACTIVE, "SGD", null, null);

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            accountService.createAccount(account);
        });

        assertEquals("Branch ID must not be null", exception.getMessage());
    }

    @Test
    void testDeleteAccount_Success() {
        ClientAccount account = new ClientAccount();
        account.setAccountId(1L);

        when(accountRepository.findById(1L)).thenReturn(Optional.of(account));

        boolean isDeleted = accountService.deleteAccount(1L);

        assertTrue(isDeleted);
        verify(accountRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteAccount_NotFound() {
        when(accountRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            accountService.deleteAccount(1L);
        });

        assertEquals("Account not found with ID: 1", exception.getMessage());
    }

    @Test
    void testCreateAccount_DatabaseError() {
        ClientAccount account = createAccount(1L, ClientAccount.AccountType.SAVINGS, ClientAccount.AccountStatus.ACTIVE, "SGD", "B001", 0.0);
        
        // Simulate a DataAccessException being thrown when saving
        when(accountRepository.save(any(ClientAccount.class))).thenThrow(new DataAccessException("Database error") {});

        DatabaseException exception = assertThrows(DatabaseException.class, () -> {
            accountService.createAccount(account);
        });

        assertEquals("An error occurred while saving the account: Database error", exception.getMessage());
    }
}
