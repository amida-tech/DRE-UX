describe('Enter new medication information', function () {

	function viewMedInfo() {
		var record = element(by.css('[href="#/record"]'));
		record.click();

		var medications = element(by.id('navmedications'));
		medications.click();

		var addMed = element(by.css('[ng-click="entryModal()"]'));
		addMed.click();

		var prescription = element(by.css('[ng-click="initInfoSearch(\'prescription\')"]'));
		prescription.click();
		
		// drug info
		var drugName = element(by.model('pDrugName'));
		drugName.sendKeys('Xanax');
		var search = element(by.css('[ng-click="drugSearch(pDrugName)"]'));
		search.click();
		
		var firstRow = element(by.repeater('rxdrug in rxnormResults.compiled').row(0));
		firstRow.click();
		var next = element(by.css('[ng-click="nextStep()"]'));
		next.click();
		
		// provider info
		var provFirstName = element(by.model('pFirstName'));
		var provLastName = element(by.model('pLastName'));
		provFirstName.sendKeys('Shelly');
		provLastName.sendKeys('Senders');
		search = element(by.css('[ng-click="prescriberSearch(pFirstName, pLastName, pZip, pState)"]'));
		search.click();
		
		firstRow = element(by.repeater('prescriber in prescriberResults').row(0));
		firstRow.click();
		next = element(by.css('[ng-click="nextStep()"]'));
		next.click();
		
		// additional info
		var medImage = element(by.css('[ng-click="setSelectedImage(rximageResults.nlmRxImages[0])"]'));
		medImage.click();
		next = element(by.css('[ng-click="nextStep()"]'));
		next.click();
		
		var submit = element(by.css('[ng-click="saveMedication()"]'));
		submit.click();
	}

	beforeEach(function () {
        browser.get('http://localhost:3000/');
        browser.driver.manage().window().setSize(1280, 1024);
    });

    afterEach(function () {
		browser.manage().logs().get('browser').then(function (browserLog) {
			var errors = 0
			browserLog.forEach(function (log) {
				if (log.level.value >= 1000) {
					errors++;
				};
			})
			expect(errors).toEqual(0);
			// Uncomment to actually see the log.
			// console.log('log: ' + require('util').inspect(browserLog));
		});
	});
	
	it('should run', function() {
        viewMedInfo();
    });
});