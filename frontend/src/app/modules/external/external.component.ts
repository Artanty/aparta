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
  data = [
    {
        "id": 1,
        "name": "Person 1",
        "age": 57
    },
    {
        "id": 2,
        "name": "Person 2",
        "age": 55
    },
    {
        "id": 3,
        "name": "Person 3",
        "age": 49
    },
    {
        "id": 4,
        "name": "Person 4",
        "age": 46
    },
    {
        "id": 5,
        "name": "Person 5",
        "age": 50
    },
    {
        "id": 6,
        "name": "Person 6",
        "age": 31
    },
    {
        "id": 7,
        "name": "Person 7",
        "age": 42
    },
    {
        "id": 8,
        "name": "Person 8",
        "age": 38
    },
    {
        "id": 9,
        "name": "Person 9",
        "age": 36
    },
    {
        "id": 10,
        "name": "Person 10",
        "age": 23
    },
    {
        "id": 11,
        "name": "Person 11",
        "age": 21
    },
    {
        "id": 12,
        "name": "Person 12",
        "age": 33
    },
    {
        "id": 13,
        "name": "Person 13",
        "age": 22
    },
    {
        "id": 14,
        "name": "Person 14",
        "age": 43
    },
    {
        "id": 15,
        "name": "Person 15",
        "age": 42
    },
    {
        "id": 16,
        "name": "Person 16",
        "age": 28
    },
    {
        "id": 17,
        "name": "Person 17",
        "age": 31
    },
    {
        "id": 18,
        "name": "Person 18",
        "age": 55
    },
    {
        "id": 19,
        "name": "Person 19",
        "age": 18
    },
    {
        "id": 20,
        "name": "Person 20",
        "age": 22
    }
]
  constructor() { }

  ngOnInit(): void {
    // console.log(this.data)
  }
  go() {
    console.log(8)
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

