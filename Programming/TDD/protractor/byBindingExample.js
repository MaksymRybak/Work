var tot = element(by.binding('totValue | number:2'));
expect(tot.getText()).toMatch('1,000.00');
