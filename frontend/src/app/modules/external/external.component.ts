import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.scss']
})
export class ExternalComponent implements OnInit {
  cols: any[] = [
    {
      colName: 'Id',
      fieldName: 'id'
    },
    {
      colName: 'Name',
      fieldName: 'name'
    },
    {
      colName: 'Age',
      fieldName: 'age'
    }
  ]
  data = getMockData()
  constructor() { }

  ngOnInit(): void {
    console.log(this.data)
  }

}


// Define the structure of your mock data
interface MockData {
  id: number;
  name: string;
  age: number;
}
function getMockData() {
  // Create an array to hold the mock data
  const mockDataArray: MockData[] = [];

  // Generate 20 mock data items and add them to the array
  for (let i = 1; i <= 20; i++) {
    const mockDataItem: MockData = {
      id: i,
      name: `Person ${i}`,
      age: Math.floor(Math.random() * 40) + 18, // Generates a random age between 18 and 57
    };

    mockDataArray.push(mockDataItem);
  }
  return  mockDataArray
  console.log(mockDataArray);
}

