var elements = element.all(by.repeater('el in model.elements | filter:{filterProp:true}'));
expect(elements.count()).toBe(3);
