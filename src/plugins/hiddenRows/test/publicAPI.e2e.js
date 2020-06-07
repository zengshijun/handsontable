describe('HiddenRows', () => {
  const id = 'testContainer';

  beforeEach(function() {
    this.$container = $(`<div id="${id}"></div>`).appendTo('body');
  });

  afterEach(function() {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  describe('public API', () => {
    describe('hideRow()', () => {
      it('should hide row by passing the visual row index', () => {
        handsontable({
          data: Handsontable.helper.createSpreadsheetData(3, 3),
          hiddenRows: true,
        });

        expect(getCell(1, 0).innerText).toBe('A2');

        getPlugin('hiddenRows').hideRow(1);
        render();

        expect(getCell(1, 0)).toBe(null);
      });
    });

    describe('showRow()', () => {
      it('should show row by passing the visual row index', () => {
        handsontable({
          data: Handsontable.helper.createSpreadsheetData(3, 3),
          hiddenRows: {
            rows: [1],
          },
        });

        expect(getCell(1, 0)).toBe(null);

        getPlugin('hiddenRows').showRow(1);
        render();

        expect(getCell(1, 0).innerText).toBe('A2');
      });
    });

    describe('isHidden()', () => {
      it('should return `true` for hidden row', () => {
        handsontable({
          data: Handsontable.helper.createSpreadsheetData(3, 3),
          hiddenRows: {
            rows: [1],
          },
        });

        const plugin = getPlugin('hiddenRows');

        expect(plugin.isHidden(0)).toBe(false);
        expect(plugin.isHidden(1)).toBe(true);
        expect(plugin.isHidden(2)).toBe(false);

        getPlugin('hiddenRows').showRow(1);
        render();

        expect(plugin.isHidden(0)).toBe(false);
        expect(plugin.isHidden(1)).toBe(false);
        expect(plugin.isHidden(2)).toBe(false);

        getPlugin('hiddenRows').hideRow(2);
        render();

        expect(plugin.isHidden(0)).toBe(false);
        expect(plugin.isHidden(1)).toBe(false);
        expect(plugin.isHidden(2)).toBe(true);
      });
    });

    describe('getHiddenRows()', () => {
      it('should return collection of hidden visual row indexes', () => {
        handsontable({
          data: Handsontable.helper.createSpreadsheetData(3, 3),
          hiddenRows: {
            rows: [1],
          },
        });

        const plugin = getPlugin('hiddenRows');

        expect(plugin.getHiddenRows()).toEqual([1]);

        getPlugin('hiddenRows').showRow(1);
        render();

        expect(plugin.getHiddenRows()).toEqual([]);

        getPlugin('hiddenRows').hideRows([0, 2]);
        render();

        expect(plugin.getHiddenRows()).toEqual([0, 2]);
      });

      it('should return correct visual indexes when rows sequence is non-contiguous ' +
         '(force desync between physical and visual indexes)', () => {
        const hot = handsontable({
          data: Handsontable.helper.createSpreadsheetData(10, 1),
          rowHeaders: true,
          hiddenRows: {
            rows: [1],
            indicators: true,
          },
        });

        hot.rowIndexMapper.setIndexesSequence([0, 9, 1, 2, 3, 4, 5, 6, 7, 8]);

        const plugin = getPlugin('hiddenRows');

        expect(plugin.getHiddenRows()).toEqual([2]);

        getPlugin('hiddenRows').showRow(2);
        render();

        expect(plugin.getHiddenRows()).toEqual([]);

        getPlugin('hiddenRows').hideRows([3, 6]);
        render();

        expect(plugin.getHiddenRows()).toEqual([3, 6]);
      });
    });

    describe('isValidConfig()', () => {
      it('should return `false` for rows passed as not a number', () => {
        handsontable({
          data: Handsontable.helper.createSpreadsheetData(3, 3),
          hiddenRows: true,
        });

        const plugin = getPlugin('hiddenRows');

        expect(plugin.isValidConfig()).toBe(false);
        expect(plugin.isValidConfig(null)).toBe(false);
        expect(plugin.isValidConfig(void 0)).toBe(false);
        expect(plugin.isValidConfig(1)).toBe(false);
        expect(plugin.isValidConfig({ index: 1 })).toBe(false);
        expect(plugin.isValidConfig([])).toBe(false);
        expect(plugin.isValidConfig([[]])).toBe(false);
        expect(plugin.isValidConfig([null])).toBe(false);
        expect(plugin.isValidConfig([void 0])).toBe(false);
        expect(plugin.isValidConfig(['1'])).toBe(false);
        expect(plugin.isValidConfig([{ index: 1 }])).toBe(false);
      });

      it('should return `true` for rows, which are within the range of the table size', () => {
        handsontable({
          data: Handsontable.helper.createSpreadsheetData(3, 3),
          hiddenRows: true,
        });

        const plugin = getPlugin('hiddenRows');

        expect(plugin.isValidConfig([0])).toBe(true);
        expect(plugin.isValidConfig([1, 2])).toBe(true);
        expect(plugin.isValidConfig([0, 1, 2])).toBe(true);

        expect(plugin.isValidConfig([-1])).toBe(false);
        expect(plugin.isValidConfig([-1, 0])).toBe(false);
        expect(plugin.isValidConfig([0, 1, 2, 3])).toBe(false);
        expect(plugin.isValidConfig([3])).toBe(false);
      });
    });
  });
});
