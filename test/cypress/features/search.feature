Feature: Search

  Scenario: Search for Transaction in mainnet, signed off
    Given I am on Dashboard page
    When I click on searchIcon
    And I search for transaction 881002485778658401
    Then I click on searchTransactionRow
    Then I should be on Tx Details page of 881002485778658401

  Scenario: Search for Feel ID
    Given I am on Dashboard page
    When I click on searchIcon
    And I search for account 537318935439898807L
    Then I click on searchAccountRow
    Then I should be on Account page of 537318935439898807L

  Scenario: Search for non-existent account
    Given I am on Dashboard page
    When I click on searchIcon
    And I search for delegate 43th3j4bt324
    Then I should see no results

