n, k = map(int, input().split())
nums = list(map(int, input().split()))
# 1 2 3 4 5 6
pref_1 = [0] * (n + 1)
pref_2 = [0] * (n + 1)
pref_1[1] = nums[0]
pref_2[1] = -nums[0]

sign = 0
for i in range(2, n + 1):
    pref_1[i] += sign * nums[i - 1] + (1 - sign) * -nums[i - 1] + pref_1[i - 1]
    pref_2[i] += (1 - sign) * nums[i - 1] + sign * -nums[i - 1] + pref_2[i - 1]
    sign = 1 - sign
flag = False
for left in range(1, n + 1):
    for right in range(left, n + 1):
        if (left % 2 == 1 and pref_1[right] - pref_1[left - 1] == k) or (left % 2 == 0 and pref_2[right] - pref_2[left - 1] == k) and not flag:
            print("YES")
            flag = True
if not flag: 
    print("NO")